export const programs: Program[] = [
	{
		name: '42',
		initial_state: {},
		code: `
x := 6;
y := 7;
z := 0;
while x > 0 do
	x := x - 1;
	v := y;
	while v > 0 do
		v := v - 1;
		z := z + 1
	end
end
`
	},
	{
		name: '42 (Free Variables)',
		initial_state: { x: 6, y: 7 },
		code: `
while x > 0 do
	x := x - 1;
	v := y;
	while v > 0 do
		v := v - 1;
		z := z + 1
	end
end
`
	},

	{
		name: 'Fibonacci',
		initial_state: {},
		code: `
x := 0;
y := 1;
z := 0;
while x < 100 do
	z := x + y;
	x := y;
	y := z
end
`
	},

	{
		name: 'Equation',
		initial_state: { x: 3, y: 9 },
		code: `
z := (x+3) * (y-2)
`
	},
	{
		name: 'Equation Derivation',
		initial_state: { y: 4 },
		code: `
(2 - -4) * (11 - y)
`
	},

	{
		name: 'Bool Derivation',
		initial_state: {},
		code: `
!1=1 || (true && 3 <= 4) 
`
	},
	{
		name: 'Program Derivation',
		initial_state: { x: 3 },
		code: `
y := 1;
while !(x=1) do
	y := y * x;
	x := x -1
end
`
	}
];
