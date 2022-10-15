---
title: "A Review of Probabilistic Logic: NeSy - LNN"
date: 2022-10-09T15:01:31+01:00
draft: false
---



Logical Neural Network[^1] is proposed by IBM in 2020. The key ideas of LNN are simple:

1. Extend the truth value of logical formula from $\{True, False\}$ to real numbers. The authors called this extended logic *weighted real-value logic*. Typically, when the truth values range within $[0, 1]$, they can serve as probabilities.
2. For each logical formula, create a neural net, so that **evaluating the truth value of a logical formula is equivalent to evaluate a neural net**.
3. The parameters of neural nets can be learnt through training examples.

The first and the third point is obvious, but the second point may not be so easy to understand. How to map a logical formula to a neural net? Here is an example. Suppose we have such 2 formulas in weighted real-value logic. 
$$
(Cat ⨁ Dog) → Pet
$$

$$
Whiskers ⨂ Tail ⨂ (LaserPointer → Chases)) → Cat
$$

Note that the 2 operators $⨂$ and $⨁$ is analogous to $\land$ and $\lor$ in classical logic. The first formula expresses that *dogs OR cats ARE pets*, and the second formula says *something with whiskers AND a tail AND will chase a laser pointer IS a cat*. The logical neural networks of these 2 formulas are shown below:

![LNN example](/images/lnn-example1.png)

We can learn from the example that **a logical neural network looks like the syntax tree of the formula**, where the leaf nodes (input nodes) are the atoms and the internal nodes (hidden nodes) are operators. Of course, an LNN has something more than a syntax tree: the edges (connections) are associated with weights,and the nodes (neurons) are associated with activation functions, plus the corresponding bias parameters. Thus, the LNN of the first formula  $(Cat ⨁ Dog) → Pet$ is equivalent to such a function 
$$
z_1 = ⨁(w_{11}x_{cat} + w_{12}x_{dog}, b_1)\\
z_2 = →(w_{21}z_1 + w_{22}x_{pet}, b2)
$$
Suppose we are given the truth value of atoms $x_{Cat}$, $x_{Dog}$, and $x_{Pet}$, then we can calculate the truth value of the formula, which is denoted by $y_2$, by the above equations. This is called *upward pass of inference*, because we are performing inference from the input nodes up to the output node. Conversely, given the truth value of atoms  $x_{Cat}$, $x_{Dog}$ and the the truth value $z_2$ of the whole formula, we can derive the truth value of $x_{Pet}$. This is called *downward pass of inference*.

One may wonder what exactly computation do the operators $⨁, ⨂, →$ perform. These are design choices left by the user. Users can define their own operators that mimic the corresponding logical operators. In the paper[^1], the authors defined the operators as:
$$
⨁(\boldsymbol{w}, \boldsymbol{x}, b) = a(1 - b +  \boldsymbol{w}^\top  \boldsymbol{x}) \\
⨂(\boldsymbol{w}, \boldsymbol{x}, b) = a(b - \boldsymbol{w}^\top (1- \boldsymbol{x})) 
$$
where $x, y$ are truth values of atoms or sub-formulas, $\boldsymbol{w}, b$ are connection weights and bias of the neural net, and $a:\mathbb{R} \rightarrow [0,1]$ is the activation function of that neuron. $a$ could be any function that map the linear combination to the unit interval, and should satisfy the property $a(1-x)=1-a(x)$. In the paper, the authors simply defined it as $a(x) = max\{0,min\{1,x\}\}$. According to the De Morgan laws, the logical implication is derived as:

$$
→(w_x,x,w_y,y,b) = a(1-b+w_x(1-x)+w_yy)
$$


With these key ideas of LNN in mind, how can we use LNN to address our central question$\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^Y$​? Let's walk through the simple *modus ponens* example. Consider the below 3 sentences:

$$
\begin{align*}
& \phi_1 = P \\
& \phi_2 = P \implies Q \\
& \phi_3 = Q\end{align*}
$$

The problem is, what is $Pr(\phi_3)$, given $Pr(\phi_1), Pr(\phi_2)$? From the perspective of LNN, the problem can be framed as "given $x_{\phi_1}$ and $z_{\phi_2}$, infer $y_{\phi_3}$":

![LNN example 2](/images/LNN-example2.png)

therefore, the problem is equivalent to solve the below equation with $y_{\phi_2}$ as the only unknown
$$
z_{\phi_2} = a(1-b+w_x(1-x_{\phi_1})+w_yy_{\phi_2})
$$
where $z_{\phi_2}=Pr(\phi_2), x_{\phi_1}=Pr(\phi_1)$, $a(·)$ is the user selected activation function, and $w_{x}, w_{y}, b$ are network parameters learnt from training data. How to learn the weights and bias is out of the scope of our consideration, but interested readers can learn more from the LNN paper[^1]. 

One more thing to note is that, here we only assign one single real value to the logical formula to describe their truth. Yet in the LNN paper, truth value of logical formulas are described by lower and upper bounds, i.e., a real-value interval, and all the neurons take as input pairs of values and output a pair of bounds. The authors claimed that  an elegant representation of uncertainty in light of the open-world assumption, e.g., explicitly initializing unknown facts with lower bound $L = 0$ and upper bound $U = 1$. 



[^1]: Riegel, R., Gray, A., Luus, F., Khan, N., Makondo, N., Akhalwaya, I. Y., ... & Srivastava, S. (2020). Logical neural networks. *arXiv preprint arXiv:2006.13155*.
