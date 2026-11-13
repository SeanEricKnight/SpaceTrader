"""Portable packaging/data checks; does not compile or execute Swift."""
from pathlib import Path
import hashlib
import json
import math
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parent
catalog = json.loads((ROOT / 'SpaceTrader/Catalog.json').read_text())
with zipfile.ZipFile(ROOT / 'Original-Source-1.2.2.zip') as archive:
    assert archive.testzip() is None
    source = archive.read('Src/Global.c').decode('mac_roman').replace('\r', '\n')
    header = archive.read('Src/spacetrader.h').decode('mac_roman').replace('\r', '\n')
macros = dict(re.findall(r'^#define\s+(\w+)\s+(-?\d+)\s*$', header, re.M))
def rows(name):
    block = source.split(' ' + name + '[')[1].split('};')[0]
    return re.findall(r'\{\s*"([^"]+)"([^}]+)\}', block)
def number(token):
    return int(macros[token] if token in macros else token)
for good, (name, rest) in zip(catalog['goods'], rows('Tradeitem')):
    tokens = [t.strip() for t in rest.strip().strip(',').split(',')]
    keys = ['production', 'usage', 'peak', 'base', 'increment', 'variance', 'crisis', 'cheap', 'expensive']
    assert good['name'] == name
    for key, token in zip(keys, tokens):
        assert good[key] == number(token), (name, key, good[key], token)
ship_keys = {'bays': 0, 'weapons': 1, 'shields': 2, 'range': 5, 'tech': 6, 'fuelCost': 7, 'price': 8, 'hull': 11}
for ship, (name, rest) in zip(catalog['ships'], rows('Shiptype')[:10]):
    tokens = [t.strip() for t in rest.strip().strip(',').split(',')]
    assert ship['name'] == name
    for key, index in ship_keys.items():
        assert ship[key] == number(tokens[index]), (name, key)
assert len(catalog['goods']) == 10 and len(catalog['ships']) == 10
names_block = source.split(' SolarSystemName[')[1].split('};')[0]
assert catalog['names'] == re.findall(r'^\s*"([^"]+)"', names_block, re.M)
assert len(set(catalog['names'])) == 120

# Parse the actual generated OpenStep plist and verify all build references.
raw = (ROOT / 'SpaceTrader.xcodeproj/project.pbxproj').read_text()
tokens = re.findall(r'"(?:\\.|[^"\\])*"|[{}()=;,]|[^\s{}()=;,]+', re.sub(r'//[^\n]*', '', raw))
position = 0
def take(expected=None):
    global position
    token = tokens[position]; position += 1
    if expected is not None:
        assert token == expected, (token, expected)
    return token
def value():
    token = take()
    if token == '{':
        result = {}
        while tokens[position] != '}':
            key = take(); key = json.loads(key) if key.startswith('"') else key
            take('='); result[key] = value(); take(';')
        take('}'); return result
    if token == '(':
        result = []
        while tokens[position] != ')':
            result.append(value())
            if tokens[position] == ',': take(',')
        take(')'); return result
    return json.loads(token) if token.startswith('"') else token
project = value()
assert position == len(tokens)
objects = project['objects']
assert project['rootObject'] in objects
refs = {key: obj for key, obj in objects.items() if obj['isa'] == 'PBXFileReference'}
for ref in refs.values():
    if ref['sourceTree'] == '<group>': assert (ROOT / 'SpaceTrader' / ref['path']).is_file()
for obj in objects.values():
    for key in ('fileRef', 'buildConfigurationList', 'mainGroup', 'productRefGroup', 'productReference'):
        if key in obj: assert obj[key] in objects
    for key in ('buildConfigurations', 'buildPhases', 'children', 'targets', 'files'):
        for ref in obj.get(key, []): assert ref in objects
sources = next(o for o in objects.values() if o['isa'] == 'PBXSourcesBuildPhase')
assert len(sources['files']) == 4
resources = next(o for o in objects.values() if o['isa'] == 'PBXResourcesBuildPhase')
resource_names = {refs[objects[r]['fileRef']]['path'] for r in resources['files']}
assert resource_names == {'Catalog.json', 'LICENSE.txt'}
scheme = ET.parse(ROOT / 'SpaceTrader.xcodeproj/xcshareddata/xcschemes/SpaceTrader.xcscheme')
for buildable in scheme.findall('.//BuildableReference'):
    assert objects[buildable.attrib['BlueprintIdentifier']]['isa'] == 'PBXNativeTarget'

# Connectivity follows from spacing: cardinal neighbors are <= 12 pc apart.
# Check jitter extremes and random grids with the same RNG family as the engine.
for dx in range(-2, 3):
    for dy in range(-2, 3):
        assert math.ceil(math.hypot(9 + dx, dy)) <= 12
for seed in range(100):
    state = seed
    def random(limit):
        global state
        state = (state * 6364136223846793005 + 1442695040888963407) & ((1 << 64)-1)
        return (state >> 32) % limit
    points = [(i % 12 * 9 + random(3), i // 12 * 9 + random(3)) for i in range(120)]
    seen = {0}; frontier = [0]
    while frontier:
        i = frontier.pop()
        for j in range(120):
            if j not in seen and math.ceil(math.dist(points[i], points[j])) <= 13:
                seen.add(j); frontier.append(j)
    assert len(seen) == 120
print('PASS: original catalog values and names; ZIP integrity; Xcode project graph; app source/resource references; scheme XML; galaxy connectivity.')
print('NOT RUN: Swift compilation, XCTest, simulator, or iPhone UI/device checks.')
