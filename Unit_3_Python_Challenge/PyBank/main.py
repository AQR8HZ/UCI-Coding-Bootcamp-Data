import os
import csv

sourceCSV = os.path.join('Resources', 'budget_data.csv')

totalMonths = 0
netTotal = 0
prevPrLo = 0
totChnge = 0
grtIncre = 0
grtDecre = 0

increMon = ""
decreMon = ""


with open(sourceCSV, 'r') as csvfile:

  # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')

    csv_header = next(csvreader)

    for row in csvreader:

    	totalMonths += 1
    	netTotal = netTotal + int(row[1])

    	if prevPrLo != 0 or totChnge != 0:
    		totChnge = totChnge + (int(row[1]) - prevPrLo)

    	if grtIncre < int(row[1]) - prevPrLo :
    		grtIncre = int(row[1]) - prevPrLo
    		increMon = row[0]

    	if grtDecre > int(row[1]) - prevPrLo:
    		grtDecre = int(row[1]) - prevPrLo
    		decreMon = row[0]

    	prevPrLo = int(row[1])

    avgChange = totChnge / (totalMonths - 1)

    print(f"\n\nFinancial Analysis")
    print(f"---------------------------------------------------------")
    print(f"                Total Months: {totalMonths} ")
    print(f"                   Net Total: ${format(netTotal, ',')} ")
    print(f"              Average Change: ${format(round(avgChange,2), ',')} ")
    print(f"Greatest Increase in Profits: {increMon} (${format(grtIncre, ',')}) ")
    print(f"Greatest Decrease in Profits: {decreMon} (${format(grtDecre, ',')}) ")


# Specify the file to write to
output_path = os.path.join("Outputs", "Summary.txt")

# Write the outout rows to the txt file
with open(output_path, "w") as text_file:
    print(f"Financial Analysis", file=text_file)
    print(f"---------------------------------------------------------", file=text_file)
    print(f"                Total Months: {totalMonths} ", file=text_file)
    print(f"                   Net Total: ${format(netTotal, ',')} ", file=text_file)
    print(f"              Average Change: ${format(round(avgChange,2), ',')} ", file=text_file)
    print(f"Greatest Increase in Profits: {increMon} (${format(grtIncre, ',')}) ", file=text_file)
    print(f"Greatest Decrease in Profits: {decreMon} (${format(grtDecre, ',')}) ", file=text_file)

print(f"\n\nOutput file created, please review '{output_path}' file")