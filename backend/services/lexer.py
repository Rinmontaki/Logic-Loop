import re

def tokenize_line(line):
    tokens = []
    line = line.strip()
    if re.match(r'(?i)^inicio$', line):
        tokens.append(('INICIO', line))
    elif re.match(r'(?i)^fin$', line):
        tokens.append(('FIN', line))
    elif re.match(r'(?i)^escriba', line):
        tokens.append(('ESCRIBA', line))
    elif re.match(r'(?i)^entero$', line):
        tokens.append(('ENTERO', line))
    elif re.match(r'(?i)^cadena\s*\[\d+\]$', line):
        tokens.append(('CADENA', line))
    elif re.match(r'^"[^"]*"$', line):
        tokens.append(('STRING', line))
    elif line == '':
        pass  # Ignorar líneas vacías
    else:
        tokens.append(('UNKNOWN', line))
    return tokens

def tokenize(code):
    lines = code.strip().split('\n')
    all_tokens = []
    for line in lines:
        all_tokens.extend(tokenize_line(line))
    return all_tokens
