import os
import csv

sourceCSV = os.path.join('Resources', 'employee_data.csv')  


us_state_abbrev = {
    'Alabama':       'AL', 'Alaska':      'AK', 'Arizona':        'AZ', 'Arkansas':      'AR', 'California':     'CA', 
    'Colorado':      'CO', 'Connecticut': 'CT', 'Delaware':       'DE', 'Florida':       'FL', 'Georgia':        'GA', 
    'Hawaii':        'HI', 'Idaho':       'ID', 'Illinois':       'IL', 'Indiana':       'IN', 'Iowa':           'IA', 
    'Kansas':        'KS', 'Kentucky':    'KY', 'Louisiana':      'LA', 'Maine':         'ME', 'Maryland':       'MD',
    'Massachusetts': 'MA', 'Michigan':    'MI', 'Minnesota':      'MN', 'Mississippi':   'MS', 'Missouri':       'MO', 
    'Montana':       'MT', 'Nebraska':    'NE', 'Nevada':         'NV', 'New Hampshire': 'NH', 'New Jersey':     'NJ',
    'New Mexico':    'NM', 'New York':    'NY', 'North Carolina': 'NC', 'North Dakota':  'ND', 'Ohio':           'OH',
    'Oklahoma':      'OK', 'Oregon':      'OR', 'Pennsylvania':   'PA', 'Rhode Island':  'RI', 'South Carolina': 'SC',
    'South Dakota':  'SD', 'Tennessee':   'TN', 'Texas':          'TX', 'Utah':          'UT', 'Vermont':        'VT',
    'Virginia':      'VA', 'Washington':  'WA', 'West Virginia':  'WV', 'Wisconsin':     'WI', 'Wyoming':        'WY',
    }

with open(sourceCSV, 'r') as csvfile:


#  Input: Emp ID,Name,DOB,SSN,State
# Output: Emp ID,First Name,Last Name,DOB,SSN,State


    # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')

    csv_header = next(csvreader)

    for row in csvreader:

        # Split fields by spaces or "-"" 
        names  = row[1].split(" ") # Full Name
        dob    = row[2].split("-")
        ssn    = row[3].split("-")
        stAbbr = us_state_abbrev[row[4]]
        # Print data fields for validation
        # print(f"Name:{names} DOB: {dob} SSN: {ssn}  State: {stAbbr}" )

        # Prepare output fields with new format
        empID       = row[0]
        firstName   = names[0]
        lastName    = names[1]
        dateOfBirth = dob[1] + "/" + dob[2] + "/" + dob[0] 
        maskSSN     = "***-**-" + ssn[2]
        # Print data fields for validation
        # print(f"Fist Name: {firstName}  Last Name: {lastName} DOB: {dateOfBirth}  SSN: {maskSSN}")

        # Prepare output record as a single row
        outputRecord = empID + ", " + firstName + ", " + lastName + ", " + dateOfBirth + ", " + maskSSN + ", " + stAbbr

        # Print data field for validation
        print(f"Formated Record {outputRecord}")





