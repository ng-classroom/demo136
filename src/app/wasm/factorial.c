#include <emscripten.h>

int EMSCRIPTEN_KEEPALIVE factorial(int n) {
   if(n < 0) return 0;
   else if(n > 1) return n*factorial(n-1);
   return 1;
}