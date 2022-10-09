---
title: "Review Prob Logic NeSy LNN"
date: 2022-10-09T15:01:31+01:00
draft: true
---



Logical Neural Network[^1] is Proposed by IBM.



The key ideas of LNN are simple:

1. Extend the truth value of logical formula from $\{True, False\}$ to real numbers, typically $[0, 1]$
2. For each logical formula, create a neural net, so that evaluating the truth value of a logical formula is to evaluate a neural net.
3. The parameters of neural nets can be learnt through training examples.

The first and the third point is obvious, but the second point may not be so be so easy to understand. Here is an example. Suppose we have such 2 logical formulas 
$$
(Cat ⨁ Dog) → Pet
$$

$$
Whiskers ⨂ Tail ⨂ (LaserPointer → Chases)) → Cat
$$

Note that the 2 operators $⨂$ and $⨁$ is analogous to $\land$ and $\lor$ in classical logic. The first formula expresses that *dogs OR cats ARE pets*, and the second formula says *something with whiskers AND a tail AND will chase a laser pointer IS a cat*. The logical neural networks of these 2 formulas are shown below:

![LNN example](/images/lnn-example1.png)

We can learn from the example that **a logical neural network is the syntax tree of the formula**, where the leaf nodes (input nodes) are the atoms and the internal nodes (hidden nodes) are operators. Of course, an LNN has something more than a syntax tree: the edges (connections) are associated with weights, and the nodes (neurons) are associated with activation functions, and the corresponding bias parameters. Thus, the LNN of the first formula  $(Cat ⨁ Dog) → Pet$ is  equivalent to such a function 
$$
z_1 = ⨁(w_{11}x_{cat} + w_{12}x_{dog}, b_1)\\
z_2 = →(w_{21}z_1 + w_{22}x_{pet}, b2)
$$
Suppose we are given the truth value of atoms $x_{Cat}$, $x_{Dog}$, and $x_{Pet}$, then we can calculate the truth value of the formula, which is denoted by $z_2$, by the above equations. Conversely, given the truth value of atoms  $x_{Cat}$, $x_{Dog}$ and the the truth value $z_2$ of the whole formula, we can derive the truth value of $x_{Pet}$.

One may wonder what exactly is the operators $⨁, ⨂, →$. These are design choices left by the user. Users can define their own operators that mimic the corresponding logical operators. In the paper[^1], the authors defined the functions as:
$$
⨁(\boldsymbol{w}, \boldsymbol{x}, b) = a(1 - b +  \boldsymbol{w}^\top  \boldsymbol{x}) \\
⨂(\boldsymbol{w}, \boldsymbol{x}, b) = a(b - \boldsymbol{w}^\top (1- \boldsymbol{x})) \\
→(w_x,x,w_y,y,b) = a(1-b+w_x(1-x)+w_yy)
$$
 where $a:\mathbb{R} \rightarrow [0,1]$ is the activation function of that neuron. $a$ could be any function that map the linear combination to the unit interval, and satisfies the property $a(1-x)=1-a(x)$. In the paper, the authors simply defined it as $a(x) = max\{0,min\{1,x\}\}$.



With these key ideas of LNN in mind, how can we use LNN to solve our central question$\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^Y$? 





[^1]: Riegel, R., Gray, A., Luus, F., Khan, N., Makondo, N., Akhalwaya, I. Y., ... & Srivastava, S. (2020). Logical neural networks. *arXiv preprint arXiv:2006.13155*.
