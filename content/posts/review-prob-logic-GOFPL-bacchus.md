---
title: "A Review of Probabilistic Logic: GOFPL - Bacchus"
date: 2022-07-31T20:46:07+01:00
draft: true
---


So far, we reviewed two probabilistic logic theories: Nilsson's Probabilistic Logic and Bundy's Incidence Calculus. However, within these logics, we can only use probability at a meta-level, but cannot talk about probability within the logic. Like example 2.1, with the three propositions $\{rainy, sunny, windy\}$, we can only talk about $\neg windy \land rainy$ or $(sunny \lor windy) \land \neg rainy$, and compute their probabilities, but not the **relations between the probabilities of them**, such as "the probability of rainy is less than that of sunny". In Fahiem Bacchus' Lp, a probability operator is explicitly introduced as a primitive, so that we can talk about probability within the language, such as $prob(rainy) < prob(sunny)$. 

Lp is such a first-order probabilistic language that is designed to express rich information, not only relations among objects but also relations among probabilities of objects. Bacchus also proposed a corresponding proof system for the language, consisting of axioms and inference rules. Personally speaking, I consider Lp to be a sophisticated theory that can do far more than solving our "central question", and the cost is the representation and reasoning complexity. Only use Lp when necessary. Using Lp to merely address the central question would be an overkill.

First-order logic is the foundation of classical logic theory. I assume the readers are familiar with it, including the syntax, semantics, and proof theory. Here is just a quick comparison between propositional logic and first-order logic: propositional logic only defines the relation among propositions $\{\phi_1, \phi_2, ..., \phi_n \}$ using connectives like $\land, \rightarrow$, while first-order logic extends propositional logic but defines what constitutes a proposition. Therefore, in first-order logic, we can see more elements, including functions, predicates, quantifiers, variables, and constants. Below is an example showing how knowledge can be represented by first-order logic:

$$
\begin{align*}& \phi_1 = student(Jane) \\& \phi_2 = student(Jane) \land from(jane, School\_A) \\& \phi_3 = \forall{x}.[student(x) \land from(x, School\_A) \rightarrow female(x)]\end{align*}
$$

Proposition $\phi_1$ says "Jane is a student". Proposition $\phi_2$ says "Jane is a student from school A". Proposition $\phi_3$ says "All students from school A are female". The three propositions have an inner structure. They are constituted by constants ($Jane, School\_A$), variables ($x$), predicates ($student/1, from/2, female/1$), and quantifiers ($\forall$). These propositions are unlike those in previous examples 1.1, 1.2, and 2.1. Very generally speaking, first-order logic constitutes propositions by asserting relations (predicates) among a set of objects (variables, functions, and constants). 

Assigning probability to first-order logical propositions could be problematic. It is OK to assign and process probabilities to $\phi_1$ and $\phi_2$ as we did in Probabilistic Logic or Incidence Calculus. Supposed that $Pr(\phi_1) = 0.8$, we can interpret it as "there are a number of possible worlds of equal probability, and in 80% of these possible worlds, Jane is a student".

 But when it comes to $\phi_3$, we meet the first question: what does $Pr(\phi_3) = 0.8$ mean? Recall that $\phi_3$ says "All students from school A are female", then we can have at least two meanings of $Pr(\phi_3)$

1. "There are a number of possible worlds of equal probability, and in 80% of these  worlds, all students from school A are female"
2. "In this real world, 80% of the students from school A are female"
We can see the differences between the two interpretations. The former imagines multiple possible worlds, while the latter doesn't bother the possible worlds. When our propositions involve relations among multiple objects, we can interpret probability as proportion or frequency. Correspondingly, when our propositions only state properties of one object or assertions of one special, non-recurrent event, we usually interpret probability as the degree of belief.

We need to distinguish different types of probabilities. Yes, we have almost no controversy about how probabilities behave, which is defined by probability axioms. However, we are not sure about what on earth probability is. Some argue that probability is just proportion or frequency that reflects objective properties of the real world, while some claim that probability is the degree of belief that reflects the subjective state of our mind. Some suggest that the two types of probabilities are essentially the same thing, while some think that they are different. The main argument seems whether the probability is objective or subjective, or how much objective and how much subjective. I've ever seen 6 interpretations of probability lie in different locations of this objective-subjective spectrum, and I am sure there should be more than 6 in the mathematical and philosophical literature. 

If they are not the same thing, the subsequent problem becomes, can they be connected? We know that though computers represent integers and floating numbers in different ways, they are still numbers and we still can add 1 with 1.5 to 2.5. Nevertheless, if 1 means the length of an item and 1.5 means the weight of another item, then adding the two numbers produce meaningless results. If the frequency probability and the degree of belief probability are different things, can we add or multiply the two types of probabilities? There is still no agreement and the discussion shall go on in the future. 

Coming back to Bacchus' Lp. Bacchus called the two types of probabilities *statistical probability* and *propositional probability*. He didn't claim that one interpretation is better than the other. He just pointed out that previous work did not distinguish the two types of probabilities, and they consider mostly propositional probability. Therefore, Bacchus designed his own probabilistic logic Lp to better represent and reason statistical probability.

The focus of Bacchus is not the central question we put in the Introduction. Bacchus aimed to propose a language that can better represent the assertions of statistical information and degree of belief. He firstly propose two separate languages for both types of assertions respectively, and lastly came up with a unified language. Hence, the main content of Bacchus' work is not about algorithms to calculate probabilities, but the formalism and proof system to represent and reason uncertain knowledge.

Now I will present the logic for propositional probability in detail. The logic for statistical probability is very similar to the propositional one.

### Propositional Probabilistic Representation and Reasoning

Following the convention of introducing first-order logic, we present the syntax, semantics, and proof system of Lp.

**Syntax**

Below are the symbols allowed to use when writing assertions in **Lp.**

* A set of n-ary function symbols $f, g, h,...$. Conventionally, constants are 0-ary function symbols.
* A set of n-ary predicate symbols $P,Q,R,...$
* A set of object variables and numeric variables $x, y, z,...$
* The connectives $\land$ and $\neg$
* The quantifier $\forall$
The above symbols are the same in the definition of ordinary first-order logic. Yet Lp is not ordinary first-order logic, it supports the expression of probability knowledge, so it introduces the following extra primitive symbols as part of the language itself:

* The binary object predicate symbol $=$. It returns $True$ if the two objects are the same object.
* The binary numeric predicate symbols $<$, $=$, and the binary numeric function symbols $+$ and $*$
* The sentential probability operator $prob$. It returns the propositional probability of a logical formula.
A formula of Lp is a string of allowed symbols satisfying the following rules:

* a single object variable or constant is an *o-term*, a singe numeric variable or constant is an *f-term*.
* If $f$ is an n-ary object function symbol, and $t_1, ...,t_n$ are o-terms, then $f(t_1, ..., t_n)$ is also an o-term. If $\boldsymbol f$ is an n-ary numeric function symbol, and $\boldsymbol{t_1, ...,t_n}$ are f-terms, then $\boldsymbol{f(t_1, ..., t_n)}$ is also an f-term.
* If $P$ is an n-ary object predicate symbol, and $t_1, ...,t_n$ are o-terms, then $P(t_1, ..., t_n)$ is a formula. If $\boldsymbol P$ is an n-ary numeric predicate symbol, and $\boldsymbol{t_1, ...,t_n}$ are f-terms, then $\boldsymbol{P(t_1, ..., t_n)}$ is a formula.
* If $\alpha$is a formula, then so is $\neg\alpha$
* If $\alpha$and $\beta$ are formulas, then so is $\alpha \land \beta$
* If $\alpha$is a formula and $x$is a numeric or object variable, then so is $\forall{x}.\alpha$
* if $\alpha$is a formula, then $prob(\alpha)$ is an f-term
The last rule of formation provides native support for constructing f-terms from existent formulas.

**Semantics**

For propositional probabilistic formulas, we interpret them via possible world semantics, as what we did in Probabilistic Logic and Incidence Calculus: assigning (propositional) probabilities to possible worlds, and then assigning possible worlds to formulas. The difference in Lp is that we work for first-order logic, and support assertions about probability, so the semantics will be more complicated. To interpret a formula in our language, we define such a structure:

$$
M=\langle \mathcal{O}, S,\mathscr{v}, \mu \rangle
$$

where

* $\mathcal{O}$is a set of objects of the domain one wish to describe
* $S$ is a set of possible worlds, or states
* $\mathscr{v}$ is a function that maps a possible world to an interpretation
* $\mu$ is a probability function over possible worlds $\mu : S \rightarrow [0,1]$ and $\sum_{s \in S} \mu(s) = 1$
We use the following rules to interpret a formula

* is $x$ is a variable, then the variable assignment determines the interpretation of the variable $x^{(M, v)}=v(x)$
* If $f$ is an n-ary function symbol, and $t_1, ...,t_n$ are terms of the same type (either object or numeric), then $[f(t_1,...,t_n)]^{(M, v)} = f^{\mathscr{v}}(t_1^{(M, v)}, ..., t_n^{(M, v)})$
* If $P$ is an n-ary predicate symbol, and $t_1, ...,t_n$ are terms of the same type (either object or numeric), then $(M,s,v)\vDash P(t_1,...,t_n) \quad iff \quad \langle t_1^{(M, v)}, ..., t_n^{(M, v)} \rangle \in P^{\mathscr{v}(s)}$
* If $s$ and $t$ are terms of the same type, then $(M, v) \vDash (s=t) \quad iff \quad s^{(M, v)} = t^{(M, v)}$
* For every formula $\alpha$, we have $(M,s, v)  \vDash (\neg \alpha) \quad iff \quad (M.S.v) \nvDash \alpha$
* For every pair of formulas $\alpha$ and $\beta$, we have  $(M,s, v)  \vDash (\alpha \land \beta) \quad iff \quad (M.S.v) \vDash \alpha \quad and \quad (M.S.v) \vDash \beta$
* For every formula $\alpha$ and object variable $x$, we have $(M,s,v)  \vDash \forall{x}.\alpha \quad iff \quad (M.S.v[x/o]) \vDash \alpha \quad for \ all \ o \in \mathcal{O}$ where $v[x/o]$ is the variable assignment function identical to $v$ except that it maps the variable $x$ to the individual $o$
* For every formula $\alpha$ and numeric variable $r$, we have $(M,s,v)  \vDash \forall{x}.\alpha \quad iff \quad (M.S.v[x/o]) \vDash \alpha \quad for \ all \ r \in \mathbb{R}$ where $v[x/r]$ is the variable assignment function identical to $v$ except that it maps the variable $x$ to the real number $r$
* For every formula $\alpha$, the f-term created by the probability operator $prob$ is interpreted as $[prob(\alpha)]^{(M,v)} = \mu(\{s \in S|(M,s,v) \vDash \alpha \})$
**Example 3.1**

Here are some examples showing how Lp can represent various knowledge, not only the assertions about relations, but also assertions about probabilities of relations.

1. "John is likely to have some type of cancer" $prob(\exists{x}.has-cancer-type(John, x)) > 0.5$
2. "It is more likely that John has lung cancer than any other type of cancer" 
$$
\begin{align*}& \forall{x}.cancer-type(x) \land x \neq lung \rightarrow \\& \quad prob(has-cancer-type(John, lung)) > prob(has-cancer-type(John, x))\end{align*}
$$
3. "It is more than twice as likely as that John has skin cancer than lung cancer" $prob(has-cancer-type(John, skin)) > 2 * prob(has-cancer-type(John, lung))$
4. "The probability that John has cancer lies in the interval 0.6 to 0.95" $prob(\exists{x}.has-cancer-type(John, x)) \in [0.6, 0.95]$
**Proof system**

A proof system is used to determine whether a formula is true or false. It should contain a set of axioms and a set of inference rules. Below are the axioms and rules of Lp. Note that the axioms are divided into 3 groups: one for ordinary first-order logic, one for real numbers, and one for probability.

*First-order Axioms*

$$
\begin{align}\alpha \rightarrow \beta \rightarrow\alpha \\(\alpha \rightarrow \beta \rightarrow \delta) \rightarrow (\alpha \rightarrow \beta) \rightarrow \alpha \rightarrow \delta \\(\neg\alpha \rightarrow \beta) \rightarrow (\neg\alpha \rightarrow \neg\beta) \rightarrow \alpha \\\forall{x}.(\alpha \rightarrow \beta) \rightarrow \forall{x}.\alpha \rightarrow \forall{x}.\beta \\\forall{x}.\alpha \rightarrow \alpha(x/t) \\t = t \\t_1 = t_{n+1} \rightarrow \dots \rightarrow t_n = t_{2n} \rightarrow ft_1...t_n = ft_{n+1}...t_{2n} \\t_1 = t_{n+1} \rightarrow \dots \rightarrow t_n = t_{2n} \rightarrow Pt_1...t_n = Pt_{n+1}...t_{2n}\end{align}
$$

*Field Axioms*

$$
\begin{align*}
x+(y+z) = (x+y)+z \\x+0 = x \\x+(-1 * x) = 0 \\x+y=y+x\\x*(y*z) = (x*y)*z\\x*1=x\\x \neq 0 \rightarrow \exists{y}.(y*x=1)\\x*y=y*x\\x*(y+z) = x*y+x*z\\\neg (1=0)\\\neg (x<x)\\x<y \rightarrow (y<z \rightarrow x<z)\\x<y \lor x = y \lor y < z\\x<y \rightarrow x+z < y+z\\0 < x \rightarrow (0<y \rightarrow 0<x*y)\\
\end{align*}
$$

*Probability Axioms*

$$
\begin{align*}prob(\alpha) \ge 0 \\prob(\alpha) + prob(\neg\alpha) = 1 \\prob(\alpha \land \beta) + prob(\alpha \land \neg\beta) = prob(\alpha) \\\alpha \rightarrow prob(\alpha) = 1\\\forall{x}.prob(\alpha) = 1 \rightarrow prob(\forall{x}.\alpha) = 1\end{align*}
$$

*Rules of Inference*

$$
\begin{align*}\{\alpha, \alpha \rightarrow \beta\} \vdash \beta \\\alpha \vdash \forall{x}.\alpha \\\alpha = \beta  \vdash prob(\alpha) = prob(\beta)\end{align*}
$$

The presented proof system is sound but not complete, meaning that every proven formula is valid, but not all valid formulas can be proved by this system. In fact, no complete proof theory exists for Lp.
