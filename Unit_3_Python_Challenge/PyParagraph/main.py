import os
import csv
import re

totWords = 0
wordLen = 0
totSentWithPunctuation = 0

sourceFile = os.path.join('Resources', 'paragraph_2.txt')

with open(sourceFile, 'r') as paragraph:
    paragraph = paragraph.read().split("\n\n")


for sentence in paragraph:
    # Remove punctuation from sentences
    sentWithPunctuation = sentence
    sentNoPunctuation = re.sub(r'[^\w\s]','',sentence)

    #Split sentence with no punctuation by words using spaces
    words = sentNoPunctuation.split(" ")
    for word in words:
        wordLen = wordLen + len(word)

    # Compute totals for output message   
    totWords = totWords + len(words) # Total words for all sentences
    avgSentLen_Words = round(totWords / len(paragraph),2) # Average words for all sentences
    avgLetterCount = round(wordLen/totWords,2) # Average letter by word for all sentences
    totSentWithPunctuation = totSentWithPunctuation + len(sentWithPunctuation)
    avgSentLen_chars = round(totSentWithPunctuation / len(paragraph),2)

    #Validate output by printing a test line
    # print(f"words: {len(words)} S w Punct. len: {len(sentWithPunctuation)} Sentence: {sentWithPunctuation}")

print(f"\n\nParagraph Analysis of '{sourceFile}' file")
print(f"---------------------------------------------------------")
print(f"          Approximate Word Count: {totWords} ")
print(f"      Approximate Sentence Count: {len(paragraph)} ")
print(f"            Average Letter Count: {avgLetterCount}  ")
print(f" Average Sentence Length (words): {avgSentLen_Words} ")
print(f" Average Sentence Length (chars): {avgSentLen_chars} ")





