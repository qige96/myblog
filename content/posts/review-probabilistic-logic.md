---
title: "A Review of Probabilistic Logic: Preface"
date: 2022-07-31T16:34:57+01:00
draft: false
---

# Introduction

There are different kinds of Logic. Deductive Logic tells us how to derive the absolute truth of the conclusion given the premises. Inductive logic. Here the term *probabilistic logic* specifically refers to probabilistic deductive logic.

Why do we study probabilistic logic? We know that by deduction, we can tell the truth of the conclusion given the truth of the premises. But how do we know the truth of the premises? In theory, we can say "we assume that $\\{\phi_1, \phi_2, ..., \phi_n \\}$ are true", but in practice, we can hardly be sure whether a proposition is REALLY true or false on earth. That's also the origin of philosophical scepticism. As a compromise, we can know that some proposition is true with a certain probability. Given these probabilistic propositions, we may calculate the probabilities of the conclusion.

The study of probabilistic logic date back to George Boole, or even earlier to xxx. However, a majority of systematic works arose in the 1980s of the last century. The straightforward motivation was the popularity of expert systems at that time, and the issues raised by them. An expert system consists of two parts: one part is a set of background facts and inference rules, and the other part is a reasoning engine. With an expert system, we can query whether an assertion is true or false. Expert systems are the direct application of a logical approach, or symbolic approach in Artificial Intelligence, and did show great power in some cases. 

However, one practical problem is, how to obtain the facts and rules required for the reasoning engine? Traditionally, knowledge was obtained by asking human experts to write what they know. Here is where the issue lies. Human beings usually express their knowledge that is true in principle, while there are often exceptions. It is super difficult for us to write down the sound and complete large enough theories for practical use. Therefore, a natural idea is to improve the reasoning engine, so that it can not only process sound theories, but also cope with uncertain knowledge that might contain errors.

Fuzzy logic, possibilistic logic, probabilistic logic, etc, were the attempts for representing and reasoning about uncertain knowledge. Among them, probabilistic logic was established based on probability theory, which is the standard tool to handle uncertainty and risks. 

The combination of probability and (deductive) logic has long been a heated research field, especially in Artificial Intelligence. We will first review some *Good Old Fashion Probabilistic Logic* (GOFPL, Part 1) that were proposed in the 1980s, and the *Statistical Relational Learning* (SRL, Part 2) that appeared in the 1990s - 2010s. Finally, we briefly look at some *Neuro-Symbolic Reasoning* (NeSy, Part 3) methods that combine probabilistic deep learning and deductive logic, which emerges in the late 2010s.

### Central Question and Key Challenge

The central question of probabilistic logic can be formalised as: given the premises $\phi_1,\dots,\phi_n$and the corresponding sets of probabilities (mostly probability intervals), what would be the set of probabilities $Y$ for the conclusion $\psi$?

$$
\phi_1^{X_1},\dots,\phi_n^{X_n}|\\!\\!\\!\approx \psi^Y
$$
The key challenge of probabilistic reasoning is handling dependency relationships, so does probabilistic logic. That is, what is the correlation among probabilistic propositions $\{\phi_1, \phi_2, ..., \phi_n, \psi \}$? Below are two examples revealing this challenge.

$$
\begin{align*}& \phi_1=\forall X \ human(X) \Rightarrow willDie(X) 
\\\\& \phi_2=human(Socrate) 
\\\\& \phi_3=willDie(Socrate)\end{align*}
$$
If $\phi_1$ and $\phi_2$ is true, then we can be sure that $\phi_3$ is true ($\{\phi_1, \phi_2 \} \vDash \phi_3$). Now we have another proposition 
$$
\phi_4:human(Dr.Who)
$$


But we are not sure whether $\phi_4$is true or false. We only know that it is very likely to be true. In terms of probability, let's assume $Pr(\phi_4) = 0.8$. In this case, we cannot tell if Dr. Who will die, but we can only tell its probability:

$$
\phi_5 =willDie(Dr.Who)
$$

$$
Pr(\phi_ 5) = Pr(\phi_1 \land \phi_4) = Pr(\phi_1)*Pr(\phi_4) = 1*0.8 = 0.8
$$



By the basic laws of probability, we can see the calculation is valid only when we assumed that $\phi_1$and $\phi_4$ are independent, which can really simplify our calculation and make our life easier. The independent assumption of the above example is quite intuitive and reasonable, but there are cases where the independence assumption is unreasonable. 

$$
\begin{align*}& \psi_ 1=passExam(X, Math) \land passExam(X, Physics) \Rightarrow smart(X) 
\\\\& \psi_ 2 = passExam(Tom, Math)  
\\\\& \psi_ 3 = passExam(Tom, Physics) 
\\\\& \psi_ 4 = smart(Tom)\end{align*}
$$

Given$\psi_1, \psi_2, \psi_3$we can deduce $\psi_4$ ($\{\psi_1, \psi_2, \psi_3 \} \vDash \psi_4$). If these propositions are all probabilistic, can we just multiply their probabilities?

$$
Pr(\psi_4) = Pr(\psi_1 \land \psi_2 \land \psi_3 ) = Pr(\psi_1)*Pr(\psi_2)*Pr(\psi_3)
$$

In reality, by commonsense or statistics, we know that people good at maths usually do well in physics, and vice versa. Thus,

$$
Pr(\psi_2 \land \psi_3) \neq Pr(\psi_2) * Pr(\psi_3)
$$

In fact, by the laws of probability, we have

$$
Pr(\psi_2 \land \psi_3) = Pr(\psi_2) * Pr(\psi_3) + c(\psi_2, \psi_3)*\sqrt{(Pr(\psi_2) * Pr(\psi_3)Pr(\neg\psi_2) * Pr(\neg\psi_3))}
$$

where $c(\psi_2, \psi_3)$means the correlation of the two random variables. From the available information from the example, it is impossible to figure out$c(\psi_2, \psi_3)$, and thus it is impossible to figure out the exact $Pr(\psi_4)$.

So far, there has been tons of work under the big umbrella of probabilistic logic. The main distinctions of different probabilistic logic can be due to the way they handle dependency relationships among probabilistic propositions. To be more exact, the various theories can be classified according to the extent they require the assumption of probabilistic independence among propositions.

- GOFPL recognises dependency relationships, but generally doesn't require independence assumption. Thus, they can fit any problems of probabilistic deduction, but the computational procedures are usually very complex.
- SRL recognises dependency relationships, but also makes some forms of independence assumption, and asks for data to work out the exact correlation information. Therefore, it can fit the problems that can assume some kind of independence. 
- NeSy generally assumes more independence among propositions and asks for more data. Hence, NeSy only works for situations when propositions are weakly correlated, and precise probability results are not strongly demanded. For example, probabilistic classification models use probability as some form of measure to make decisions. They just want the probabilities to capture the information roughly, not precisely.

In this series of posts, I present the characteristics of serval selected probabilistic logic theories. The target readers are those who want to have a quick and shallow understanding of a wide range of probabilistic logic, particularly those who have a problem in mind and want to know which probabilistic logic may help to solve the problem. I shall only highlight the typical shining points and limitations, and omit most of the details, such as mathematical proofs, algorithm analysis, and so on. Interested readers may find the original paper and additional materials in the references.
