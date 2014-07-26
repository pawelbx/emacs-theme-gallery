#include <assert.h>
double compute_fn(double z)  // [1]
{
#pragma STDC FENV_ACCESS ON  // [2]
  assert(FLT_EVAL_METHOD == 2);  // [3]
  if (isnan(z))  // [4]
    puts("z is not a number");
  if (isinf(z))
    puts("z is infinite");
  long double r;  // [5]
  r = 7.0 - 3.0/(z - 2.0 - 1.0/(z - 7.0 + 10.0/(z - 2.0 - 2.0/(z - 3.0)))); // [6] 
  feclearexcept(FE_DIVBYZERO);  // [7]
  bool raised = fetestexcept(FE_OVERFLOW);  // [8]
  if (raised)
