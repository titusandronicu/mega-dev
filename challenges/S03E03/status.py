import sys, json
d = json.load(sys.stdin); print(d["now"][11:19])
for i in d["issues"]:
    print(i["n"], i["openedAt"][11:19], i["title"][:60], "| labels", i["labels"], "| closed", i["closed"])
    for t in i["thread"]:
        print("    ", t["by"], t["kind"], t.get("label") or (t.get("body") or "")[:260].replace("\n", " "))
