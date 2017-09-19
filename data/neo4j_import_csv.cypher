CREATE (:Viewer {id: 0, name: "You", role: "Grant Writer", foundation: "Women's Health"});

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1do62iJ5V1IDRuzP-JPYwf8z96TTWUr9z_5lKXksz_Tk/export?format=csv" AS row
CREATE (:Connection {id: 1, name: row.Name, role: row.Role, degrees: row.Relationship, mutual: row.Mutual});

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1do62iJ5V1IDRuzP-JPYwf8z96TTWUr9z_5lKXksz_Tk/export?format=csv" AS row
CREATE (:Mutual {id: 1, name: row.Mutual, total: row.Mutual});

MATCH (c:Connection)
WITH c
ORDER BY c.created_at
WITH collect(c) as connections
UNWIND range(0, size(connections)-1) as ind
SET (connections[ind]).id = ind;

MATCH (m:Mutual)
WITH m
ORDER BY m.created_at
WITH collect(m) as mutuals
UNWIND range(0, size(mutuals)-1) as ind
SET (mutuals[ind]).id = ind;

MATCH (m:Mutual)
WHERE (m.total = "0")
DELETE m;

MATCH (y:Viewer), (m:Mutual)
CREATE (y)-[r:FIRST]->(m);

MATCH (y:Viewer), (c:Connection)
WHERE c.degrees = "1"
CREATE (y)-[r:FIRST]->(c);

MATCH (m:Mutual), (c:Connection)
WHERE (m.id = c.id)
CREATE (m)-[r:FIRST]->(c);

MATCH (n) RETURN n;