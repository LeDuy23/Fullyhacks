%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void yyerror(char *);
int yylex(void);

/* For simplicity, we'll use a simple symbol table */
#define MAX_SYMBOLS 100
int symValues[MAX_SYMBOLS];
char symNames[MAX_SYMBOLS][50];
int symCount = 0;

int findSymbol(char *name);
int addSymbol(char *name);
%}

%token INTEGER IDENTIFIER
%token PLUS MINUS MULTIPLY DIVIDE
%token LPAREN RPAREN

%left PLUS MINUS
%left MULTIPLY DIVIDE

%%

program:
        program statement '\n'
        | /* empty */
        ;

statement:
        expr                    { printf("Result: %d\n", $1); }
        ;

expr:
        INTEGER                 { $$ = $1; }
        | IDENTIFIER            { 
                                  int index = findSymbol(yytext);
                                  if (index == -1) {
                                      index = addSymbol(yytext);
                                      symValues[index] = 0; /* Default value */
                                  }
                                  $$ = symValues[index];
                                }
        | expr PLUS expr        { $$ = $1 + $3; }
        | expr MINUS expr       { $$ = $1 - $3; }
        | expr MULTIPLY expr    { $$ = $1 * $3; }
        | expr DIVIDE expr      { 
                                  if ($3 == 0) {
                                      yyerror("Division by zero");
                                      $$ = 0;
                                  } else {
                                      $$ = $1 / $3;
                                  }
                                }
        | LPAREN expr RPAREN    { $$ = $2; }
        ;

%%

void yyerror(char *s) {
    fprintf(stderr, "Error: %s\n", s);
}

int findSymbol(char *name) {
    for (int i = 0; i < symCount; i++) {
        if (strcmp(symNames[i], name) == 0) {
            return i;
        }
    }
    return -1; /* Not found */
}

int addSymbol(char *name) {
    if (symCount >= MAX_SYMBOLS) {
        yyerror("Symbol table full");
        return 0;
    }
    
    strcpy(symNames[symCount], name);
    return symCount++;
}

int main(void) {
    printf("Enter expressions to evaluate (Ctrl+D to exit):\n");
    yyparse();
    return 0;
}