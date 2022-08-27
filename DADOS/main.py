import csv
import json
import os
import redis

counter = 0

# dict of connections
connectionsDescendant = {}
connectionsAscendant = {}
r = redis.Redis()
r.flushall()
with open(r'../arestas-v3.csv', encoding='utf-8') as file:
    edges = csv.DictReader(file)
    for row in edges:

        source = row['origem_id_lattes'].lstrip('0')
        target = row['destino_id_lattes'].lstrip('0')
        if source in connectionsDescendant:
            connectionsDescendant[source.lstrip('0')].append(row)
        else:
            connectionsDescendant[source.lstrip('0')] = [row]

        if target in connectionsAscendant:
            connectionsAscendant[target.lstrip('0')].append(row)
        else:
            connectionsAscendant[target.lstrip('0')] = [row]

        counter += 1
        print(counter)
teste = connectionsDescendant['5822556864478183']

counter = 0
graphFromNode = {}
with open(r'../vertices-v3.csv', encoding='utf-8') as file:
    vertices = csv.DictReader(file)

    for row in vertices:
        name = row['nome'].strip()
        idLattes = row['id_lattes'].lstrip('0')
        r.set('colaborador'+name, str(idLattes))
        listVisitedDescendant = []
        neighborsDescendant = []

        widthDescendants = 0
        numberDescendantLeafs = 0
        depthDescendants = 0
        LevelsDescendants = []
        greaterWidthDescendant = 0
        fertilityWeightedDescendant = 0.0


        if idLattes in connectionsDescendant:
            Neighbors = connectionsDescendant[idLattes].copy()
            neighborsDescendant = Neighbors.copy()
            widthDescendants = len(Neighbors)
            greaterWidthDescendant = len(Neighbors)
            depthDescendants = 1 if widthDescendants > 0 else 0
            nextGeneration = []
            currentLevel = []
            while len(Neighbors) > 0:

                connection = Neighbors.pop(0)
                target = connection['destino_id_lattes'].lstrip('0')
                currentLevel.append(target)

                if target in connectionsDescendant:
                    if target not in listVisitedDescendant:
                        localWidth = len(connectionsDescendant[target])
                        if localWidth > greaterWidthDescendant:
                            greaterWidthDescendant = localWidth
                        nextGeneration += connectionsDescendant[target].copy()
                else:
                    numberDescendantLeafs += 1
                    fertilityWeightedDescendant += 1/(depthDescendants**2)

                if target not in listVisitedDescendant:
                    listVisitedDescendant.append(target)

                if len(Neighbors) == 0:
                    LevelsDescendants.append(currentLevel)
                    currentLevel = []
                    depthDescendants += 1
                    Neighbors = nextGeneration.copy()
                    nextGeneration = []

        listVisitedAscendants = []
        neighborsAscendants = []

        widthAscendants = 0
        numberAscendantsLeafs = 0
        depthAscendant = 0
        LevelsAscendants = []
        greaterWidthAscendants = 0
        fertilityWeightedAscendant = 0.0

        if idLattes in connectionsAscendant:
            print(idLattes)
            Neighbors = connectionsAscendant[idLattes]
            neighborsAscendants = Neighbors.copy()
            widthAscendants = len(Neighbors)
            greaterWidthAscendants = len(Neighbors)
            depthAscendant = 1 if widthAscendants > 0 else 0
            olderGeneration = []
            currentLevel = []
            while len(Neighbors) > 0:
                connection = Neighbors.pop(0)
                source = connection['origem_id_lattes'].lstrip('0')
                currentLevel.append(source)

                # verificando se o no atual foi visitado
                target = connection['destino_id_lattes'].lstrip('0')

                if source in connectionsAscendant:
                    if source not in listVisitedAscendants:
                        localWidth = len(connectionsAscendant[source])
                        if localWidth > greaterWidthAscendants:
                            greaterWidthDescendant = localWidth
                        olderGeneration += connectionsAscendant[source].copy()

                else:
                    numberAscendantsLeafs += 1
                    fertilityWeightedDescendant += 1 / (depthAscendant ** 2)

                if source not in listVisitedAscendants:
                    listVisitedAscendants.append(source)

                if len(Neighbors) == 0:
                    LevelsAscendants.append(currentLevel)
                    currentLevel = []
                    depthAscendant += 1
                    Neighbors = olderGeneration.copy()
                    olderGeneration = []
        # graphFromNode[idLattes]
        newNode = {
            'directDescendants': neighborsDescendant,
            'descendant': listVisitedDescendant,
            'widthDescendantsNumber': widthDescendants,
            'widthAscendantsNumber': widthAscendants,
            'numberDescendantLeafs': numberDescendantLeafs,
            'directAscendants': neighborsAscendants,
            'ascendant': listVisitedAscendants,
            'directDescendantsNumber': len(neighborsDescendant),
            'directAscendantsNumber': len(neighborsAscendants),
            'numberAscendantLeafs': numberAscendantsLeafs,
            'depthDescendant': depthDescendants,
            'depthAscendant': depthAscendant,
            'fertilityDescendant': len(listVisitedDescendant),
            'fertilityAscendant': len(listVisitedAscendants),
            'fertilityWeightedDescendant': fertilityWeightedDescendant,
            'fertilityWeightedAscendant': fertilityWeightedAscendant,
            'levelsDescendants': LevelsDescendants,
            'levelsAscendants': LevelsAscendants,
            'greaterWidthDescendant': greaterWidthDescendant,
            'greaterWidthAscendant': greaterWidthAscendants,
            'name': name,
            'id': idLattes
        }
        r.set(idLattes, str(newNode))
        counter += 1
        print(counter)

del connectionsDescendant
del connectionsAscendant

print("Writing file...")

# for key in graphFromNode:


# if os.path.exists(r'../NodesDescriptions.json'):
#    os.remove(r'../NodesDescriptions.json')
# with open(r'../NodesDescriptions.json', 'w', encoding='utf-8') as file:
#    file.write(json.dumps(graphFromNode, indent=4))

print("finish")
