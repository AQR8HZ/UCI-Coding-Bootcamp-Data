import os
import csv

sourceCSV = os.path.join('Resources', 'election_data.csv')

totalVotes = 0
candidates = dict()


with open(sourceCSV, 'r') as csvfile:


    # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')

    csv_header = next(csvreader)

    for row in csvreader:
    #   Validate information read by printing every record
        totalVotes += 1
        if row[2] in candidates.keys():
            candidates[row[2]] += 1
        else:
            candidates[row[2]] = 1


print(f"\n\nElection Results")
print(f"----------------------------------")
print(f"Total votes: {format(totalVotes,',')}")
print(f"----------------------------------")

for c, v in candidates.items():
    print(f"{c}: { '%.3f'%(v/totalVotes*100) }% (votes {format(v, ',')})" )

print(f"----------------------------------")
print(f"Winner: {max(candidates, key=candidates.get)}")
print(f"----------------------------------")


# Specify the file to write to
output_path = os.path.join("Outputs", "ElectionResults.txt")

# Write the outout rows to the txt file
with open(output_path, "w") as text_file:
    print(f"Election Results", file=text_file)
    print(f"----------------------------------", file=text_file)
    print(f"Total votes: {format(totalVotes,',')}", file=text_file)
    print(f"----------------------------------", file=text_file)

    for c, v in candidates.items():
        print(f"{c}: { '%.3f'%(v/totalVotes*100) }% (votes {format(v, ',')})" , file=text_file)

    print(f"----------------------------------", file=text_file)
    print(f"Winner: {max(candidates, key=candidates.get)}", file=text_file)
    print(f"----------------------------------", file=text_file)


print(f"\n\nOutput file created, please review '{output_path}' file")