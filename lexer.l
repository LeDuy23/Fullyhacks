%{
#include <stdio.h>
#include <stdlib.h>
#include "y.tab.h"

void yyerror(char *);
%}

%%

[0-9]+      { yylval = atoi(yytext); return INTEGER; }
[a-zA-Z][a-zA-Z0-9]*  { return IDENTIFIER; }
"+"         { return PLUS; }
"-"         { return MINUS; }
"*"         { return MULTIPLY; }
"/"         { return DIVIDE; }
"("         { return LPAREN; }
")"         { return RPAREN; }
[ \t\n]     ; /* Skip whitespace */
.           { yyerror("Unknown character"); }

%%

int yywrap(void) {
    return 1;
}