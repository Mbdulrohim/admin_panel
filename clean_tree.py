unwanted = ["node_modules", ".next"]

with open("folder_structure.txt", "r") as infile:
    lines = infile.readlines()

with open("cleaned_structure.txt", "w") as outfile:
    for line in lines:
        if not any(skip in line for skip in unwanted):
            outfile.write(line)

print("Filtered structure saved to cleaned_structure.txt")
