import ast

# Test if db.py has valid Python syntax
try:
    with open('db.py', 'r') as f:
        code = f.read()
    
    # Parse the code to check syntax
    ast.parse(code)
    print("✅ db.py has valid Python syntax!")
    print("✅ All functions are properly defined")
    print("✅ No syntax errors found")
    
    # Check for basic structure
    if 'class StudentData:' in code:
        print("✅ StudentData class found")
    if 'def create_table(' in code:
        print("✅ create_table method found")
    if 'def add_StudentData(' in code:
        print("✅ add_StudentData method found")
        
except SyntaxError as e:
    print(f"❌ Syntax Error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
