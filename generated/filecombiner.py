import os

def combine_js_files(source_directory, output_file):
    exclude_dirs = {'generated', '.git'}
    exclude_files = {'.gitignore', 'testStrings.js', '.clasp.json', 'setup.js'}
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(source_directory):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for filename in files:
                if filename.endswith('.js') and filename != output_path and filename not in exclude_files:
                    filepath = os.path.join(root, filename)
                    with open(filepath, 'r', encoding='utf-8') as infile:
                         write_to_output(filepath, source_directory, infile, outfile)
                        
def write_to_output(filepath, source_directory, infile, outfile):
    relative_path = os.path.relpath(filepath, source_directory)
    outfile.write(f"\n// --- {relative_path} ---\n")
    outfile.write(infile.read())
    outfile.write("\n")  # Add a newline between files

if __name__ == "__main__":
    script_path = os.path.dirname(os.path.abspath(__file__))
    source_dir = os.path.join(script_path, "..")
    output_path = os.path.join(script_path, "combined.js")
    combine_js_files(source_dir, output_path)
    print(f"All JS files combined into {output_path}")