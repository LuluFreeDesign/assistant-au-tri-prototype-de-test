#!/usr/bin/env python3
"""
Génère src/data/acteurs-loire-atlantique.json à partir du CSV open data ADEME.

Source : https://www.data.gouv.fr/datasets/acteurs-de-leconomie-circulaire-que-faire-de-mes-objets-et-dechets

Usage :
    python3 scripts/generate-acteurs-44.py <chemin/vers/acteurs.csv>
"""
import csv
import json
import os
import sys

csv.field_size_limit(sys.maxsize)

# Champs réellement utilisés par le proto (cards solutions, popups carte, filtres)
KEEP_FIELDS = [
    'nom', 'adresse', 'complement_dadresse', 'code_postal', 'ville',
    'latitude', 'longitude', 'type_dacteur', 'qualites_et_labels',
    'reparer', 'donner', 'revendre', 'echanger', 'trier', 'emprunter', 'preter',
    'site_web', 'identifiant',
]

# Bbox France métropolitaine (filtre les coords aberrantes)
METRO_BBOX = {'minLat': 41, 'maxLat': 51, 'minLon': -5, 'maxLon': 10}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    csv_path = sys.argv[1]
    if not os.path.isfile(csv_path):
        print(f"Erreur : fichier introuvable : {csv_path}", file=sys.stderr)
        sys.exit(1)

    results = []
    with open(csv_path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cp = (row.get('code_postal') or '').strip()
            if not cp.startswith('44'):
                continue
            try:
                lat = float(row.get('latitude') or 0)
                lon = float(row.get('longitude') or 0)
            except ValueError:
                continue
            if not (METRO_BBOX['minLat'] < lat < METRO_BBOX['maxLat']
                    and METRO_BBOX['minLon'] < lon < METRO_BBOX['maxLon']):
                continue

            obj = {}
            for k in KEEP_FIELDS:
                v = row.get(k, '') or ''
                if v:
                    obj[k] = v
            results.append(obj)

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(repo_root, 'src', 'data', 'acteurs-loire-atlantique.json')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, separators=(',', ':'))

    size_ko = os.path.getsize(out_path) / 1024
    print(f"✓ {len(results)} acteurs Loire-Atlantique écrits dans {out_path}")
    print(f"  Taille : {size_ko:.0f} Ko")


if __name__ == '__main__':
    main()
