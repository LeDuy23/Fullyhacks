
#include <stdio.h>
#include <stdlib.h>

extern int yyparse(void);

int main(void) {
    printf("Expression Parser Demo\n");
    printf("Enter expressions to evaluate (Ctrl+D to exit):\n");
    
    printf("Example: a + b * c would be tokenized as:\n");
    printf("IDENTIFIER(a) PLUS IDENTIFIER(b) MULTIPLY IDENTIFIER(c)\n\n");
    
    printf("And parsed according to operator precedence:\n");
    printf("  +\n");
    printf(" / \\\n");
    printf("a   *\n");
    printf("   / \\\n");
    printf("  b   c\n\n");
    
    printf("Now you can try your own expressions:\n");
    
    yyparse();
    return 0;
}
