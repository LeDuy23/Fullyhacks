
# Compiler and flags
CC = gcc
CFLAGS = -Wall

# Files
LEXER = lexer.l
PARSER = parser.y
MAIN = main.c

# Output
EXECUTABLE = calc

all: $(EXECUTABLE)

$(EXECUTABLE): lex.yy.c y.tab.c $(MAIN)
	$(CC) $(CFLAGS) -o $(EXECUTABLE) lex.yy.c y.tab.c $(MAIN) -lfl

lex.yy.c: $(LEXER) y.tab.h
	flex $(LEXER)

y.tab.c y.tab.h: $(PARSER)
	yacc -d $(PARSER)

clean:
	rm -f lex.yy.c y.tab.c y.tab.h $(EXECUTABLE)

run: $(EXECUTABLE)
	./$(EXECUTABLE)
