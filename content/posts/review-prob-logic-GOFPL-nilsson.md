---
title: "A Review of Probabilistic Logic: GOFPL - Nilsson"
date: 2022-07-31T20:44:36+01:00
draft: true
---


Nils Nilsson is the first person to coin the name Probabilistic Logic[^1] (In the rest of this note, I use the term "Probabilistic Logic" to indicate the particular theory of Nilsson, and "probabilistic logic" to refer to the general class of probabilistic deductive inference mechanism). His theory has also been considered the seminal work of probabilistic reasoning in Artificial Intelligence that sparked a lot of subsequent works.

Nilsson's proposed method focuses on logical sentences, i.e., propositions whose variables are all quantified by $\forall$ or $\exists$. Probabilities are assigned to sentences, served as a generalisation of truth values, such that $Pr(\phi) \in [0.8, 0.9]$ means "the probability of sentences $\phi$ being true lies in the interval of $[0.8, 0.9]$". When the probability of a sentence is 0 or 1, it means the sentence is absolutely False or Ture, and the probabilistic logic reduces to classical logic.

### Definitions

As claimed before, the key challenge of probabilistic logic is to handle the dependency relationships among the propositions. Nilsson addressed this challenge by generalising the possible world semantics. 

* For a logical theory with n sentences $\Phi = \{\phi_1,\dots,\phi_n\}$, find out all its N possible worlds (consistent truth assignments) $W = \{w_1,\dots,w_N\}$. 
* We denote the probability of a possible world as $Pr(w_i)$, Because every possible world are mutually exclusive (there is one and only one possible world is the real world), we have $\sum_{w \in W} Pr(w) = 1$
* Similarly, the probability of a sentence $\phi$ is the sum of the probabilities of possible worlds in which that sentence $\phi$ is true $Pr(\phi) = \sum_{\{w|\phi \in w\}} Pr(w)$, where $\phi \in w$ means $\phi$ is true in the world $w$.
* By establishing the connection between sentences and possible worlds, **we can represent correlation among sentences by manipulating sets of possible worlds.** For instance, $Pr(\phi_1 \land \phi_2) = \sum_{\{w|\phi_1 \in w\}\cap\{w|\phi_2 \in w\}} Pr(w)$
* we can set up a linear equation system, and work out the relation between probabilities of premises and conclusions.

**Example 1.1**

We walk through Nilsson's idea by an example shown in his original paper. Consider the below 3 sentences:

$$
\begin{align*}
& \phi_1 = P 
\\\\& \phi_2 = P \Rightarrow Q 
\\\\& \phi_3 = Q\end{align*}
$$

The problem is, what is $Pr(\phi_3)$, given $\{\phi_1, \phi_2\} \vDash\phi_3$

Now we have 3 propositions, and we don't know exactly their truth values. But we can enumerate all the possible truth assignments for them. At the first glance, each proposition can be assigned True or False, so that should be $2^3 = 8$ possible worlds. However, some of the truth assignments are impossible (inconsistent). For example, when $\phi_1$ and $\phi_2$ are both true, it is impossible for $\phi_3$ to be false. Therefore, actually, we have only 4 possible worlds (details shown in the below sematic table). 

|$P$|$P \Rightarrow Q$|$Q$|Possible World|
|:----|:----|:----|:----|
|T|T|T|1|
|T|T|F|    |
|T|F|T|    |
|T|F|F|2|
|F|T|T|3|
|F|T|F|4|
|F|F|T|    |
|F|F|F|    |


From top to bottom, we denote the possible worlds as $w_1,w_2,w_3,w_4$, and we can see the sentence $\phi_1$is true in $w_1$ and $w_2$. Thus, we can write that

$$
Pr(\phi_1) = Pr(w_1) + Pr(w_2)
$$

Similarly, we have

$$
Pr(\phi_2) = Pr(w_1) + Pr(w_3) + Pr(w_4)
$$

$$
Pr(\phi_3) = Pr(w_1) + Pr(w_3)
$$

Now, the problem can be transformed into finding the maximum and minimum of $Pr(\phi_3)$, which is a standard linear programming problem. For notational simplicity, I use $x_i$ to denote $Pr(w_i)$:

$$
\begin{align*}max (min) \\ & Pr(\phi_3) = x_1 + x_3 
\\\\s.t. 
\\\\& Pr(\phi_1) = x_1 + x_2 
\\\\& Pr(\phi_2) = x_1 + x_3 + x_4 
\\\\& \sum_{i \in [1,4]} x_i = 1
\end{align*}
$$

In this example, we don't know the values of $Pr(\phi_1)$ and $Pr(\phi_2)$. But we can still establish the relation between the  $Pr(\phi_1)$, $Pr(\phi_2)$ and $Pr(\phi_3)$. By converting the linear program into a linear equation system:

$$
\begin{bmatrix}1 
\\\\ Pr(\phi_1)  
\\\\ Pr(\phi_2)   
\end{bmatrix}  =
\begin{bmatrix} 1 & 1 & 1 & 1 
\\\\ 1 & 1 & 0 & 0 
\\\\ 1 & 0 & 1 & 1 
\\\\ 1 & 0 & 1 & 0
\end{bmatrix}  
\begin{bmatrix}
x_1
\\\\ x_2
\\\\ x_3
\\\\ x_4
\end{bmatrix}
$$

and solving this equation system, we have:

$$
Pr(\phi_3) = 0.5Pr(\phi_1) + Pr(\phi_2) - 0.5
$$

**Example 1.2**

Now we demonstrate a more practical example borrowed from this paper[^3].

$$
\begin{align*}&\phi_1 = A 
\\\\& \phi_2 = B 
\\\\& \phi_3 = C 
\\\\& \phi_4 = A \lor C
\end{align*}
$$

What's more, we have 

$$
\begin{align*}
Pr(\phi_1) \in [0.7, 0.9] 
\\\\ Pr(\phi_2) \in [0.1, 0.3] 
\\\\ Pr(\phi_3) \in [0.7, 0.9] 
\end{align*}
$$

The question is, what is $Pr(\phi_4)$ ? As what we did in Example 1, we find out all the possible worlds of the 4 sentences:

|$A$|$B$|$C$|$A \lor C$|Possible World|
|:----|:----|:----|:----|:----|
|T|T|T|T|1|
|T|T|T|F|    |
|T|T|F|T|2|
|T|T|F|F|    |
|T|F|T|T|3|
|T|F|T|F|    |
|T|F|F|T|4|
|T|F|F|F|    |
|F|T|T|T|5|
|F|T|T|F|    |
|F|T|F|T|    |
|F|T|F|F|6|
|F|F|T|T|7|
|F|F|T|F|    |
|F|F|F|T|    |
|F|F|F|F|8|

We can see that there are 8 possible worlds and $\phi_4$ is true in 6 of them. Thus, we can set up a linear program. For notational simplicity, I use $x_i$ to denote $Pr(w_i)$:

$$
\begin{align*}
max(min) \\ &Pr(\phi_4) = x_1 +x_2 + x_3 + x_4 + x_5 + x_7 
\\\\s.t. 
\\\\& 0.7 \le x_1 + x_2 + x_3 + x_4 \le 0.9 
\\\\& 0.1 \le x_1 + x_2 + x_5 + x_6 \le 0.3 
\\\\& 0.7 \le x_1 + x_3 + x_5 + x_7 \le 0.9 
\\\\& \sum_{i \in [1,8]} x_i = 1
\end{align*}
$$

Solving this linear program, we have $Pr(\phi_4) = [0.8, 1.0]$

As we can see, the space of possible worlds surges exponentially as the number of sentences increases, so the time and space complexity of Nillson's Probabilistic Logic (linear programming approach) is exponential. Therefore, performing exact probabilistic deduction is impractical for real-world problems. We need some efficient approximation inference.


[^1]: Nilsson, N. J. (1986). Probabilistic logic. *Artificial intelligence*, *28*(1), 71-87.

[^2]: Nilsson, N. J. (1994). Probabilistic logic revisited. *Artificial intelligence*, *59*(1-2), 39-42.

[^3]: Shakarian, P., Simari, G. I., Moores, G., Paulo, D., Parsons, S., Falappa, M. A., & Aleali, A. (2016). Belief revision in structured probabilistic argumentation. *Annals of Mathematics and Artificial Intelligence*, *78*(3), 259-301.
