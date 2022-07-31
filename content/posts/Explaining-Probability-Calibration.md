---
title: "Explaining Probability Calibration"
date: 2022-07-30T00:27:00+01:00
draft: false
---

This is a reading note explaining what probability calibration is, why we should use it, and how to achieve it. I will firstly introduce the origin of this notion, and then explain how to achieve probability calibration and why this can work. Lastly, I reveal the benefits of probability calibration.

## Philosophical Origin
What is probability calibration? In a word, calibration means the forecast probabilities match the relative frequencies: $fr(X|pr(X)=\beta)=\beta$, where $fr(X)$ represents the relative frequency of $X$ and $pr(X)$ represents the predicted probability of $X$. It originated in 1983 by van Fraassen[^1], from a philosophical inquiry of an epistemic virtue for partial beliefs (aka, subjective probabilities, credence), analogous to the virtue of truth for full beliefs.

Let's think about a concrete scenario. Suppose that I would like to go to a picnic tomorrow. But here in Edinburgh it often rains. If it won't rain tomorrow then I can begin to buy some food and make phone calls to friends. If it will rain tomorrow then I shall not bother preparing. The key question is whether it will rain tomorrow. I can make a \textbf{full belief} prediction that "Tomorrow it will rain!" I can verify this prediction by waiting for tomorrow's actual weather. By this verification, I can say that my full belief prediction has an epistemic virtue of truth, meaning that I can assert it a good prediction if it matches the reality, or a bad prediction if it failed to match the reality. What if I make a \textbf{partial belief} prediction that "It seems 70\% probable to rain tomorrow"? We cannot verify this prediction through the actual result of tomorrow's weather, even it would rain tomorrow indeed. Although we cannot verify the truth of my partial belief by one prediction, we can evaluate the *quality* of my partial beliefs in a long series of predictions.

Weather forecasters are evaluated by a widely accepted metric called Brier Score. Suppose that I care about the weather of Edinburgh, and predict my subjective probabilities $p_i \in [0,1]$ for $N$ days, and denote $y_i \in \{0, 1\}$ as the actual weather of these $N$ days, where $0$ standards for not raining, and $1$ vice versa. Then, the Brier Score is 
$$
BS = \frac{1}{N}\sum_{i=1}^N (p_i - y_i)^2
$$

But this Brier Score doesn't measure the epistemic virtue we are looking for. It was shown that the Brier Score is a combination of two criteria: **informativeness**(refinement) and **vindication**(calibration). Formally, suppose that among all the forecast probabilities $p_1, ..., p_N$ there are $K$ different numeric values $p_1, ..., p_K (K \le N)$. Denote $n_j$ as the number of days associated with the probability $p_j$, and $r_j$ as the rate(relative frequency) of rainy days during these $n_j$ days. Then, the Brier Score can be decomposed into the calibration term and the refinement term as:
$$
BS = C + R = [\frac{1}{K}\sum_{j=1}^K n_j(p_j - r_j)^2] + [\frac{1}{K}\sum_{j=1}^K n_jr_j(1 - r_j)]
$$


The informativeness tends to improve if the forecast probabilities get closer to $0$ or $1$. The calibration tends to improve if the forecast probabilities match the proportion, meaning that if it rained 70\% of the days on which I predicted the probability of raining was 0.7, and so on for other values. Either of the two terms improves will finally make the Brier Score improve. As van Fraassen said, informativeness and vindication are two commonly demanded criteria, and usually, they are in "desperate tension". The more informative of the theory, the less we are sure of the theory. For the following predictions, "It seems to rain tomorrow", "It seems 70\% probable to rain tomorrow", and "It is to rain tomorrow", we get more and more information, but we are less and less sure about the prediction, the greater chance the prediction will be falsified. Here,**vindication, or calibration, is the epistemic virtue of partial beliefs we are looking for in analogy to the virtue of truth of full beliefs, such that the beliefs should *match the world*.**

Later Carl Hoefer further explained[^2] that vindication, or calibration, is merely one of many virtues. If one can increase calibration without hurting other virtues, then s/he is rational to do so. However, often virtues can contradict one another. For example, if I calculate the overall frequency $freq$ of raining during the $N$ days, and make all the forecast probabilities equal to this frequency $\forall{i} \in \{1,2,..,N \} \quad p_i := freq$, then my forecast probabilities are perfectly calibrated, but it hurt informativeness, and the overall quality (e.g. the Brier Score) gets decreased. Which virtues we should choose to pursue involves trade-offs depending on the specific problems.

## Technical Mechanism
In Machine Learning, probability calibration is also a family of techniques to obtain well-calibrated probabilities. Some statistical classifiers produce scores that are NOT probabilities, such as Support Vector Machine. Calibration can be used to convert these scores into probabilities[^3]. Sometimes even probabilistic classifiers do not produce calibrated distribution, due to over-fitting or other reasons[^4]. In this case, calibration methods can also be applied. 

In principle, we can see the original classifiers $f(\boldsymbol{x}|\boldsymbol{w})$ as feature extractors[^4]. They take raw input data and produce scores and (uncalibrated) probabilities as features of the input data. Then a calibration model, essential a simple probabilistic classifier $p[f(\boldsymbol{x}|\boldsymbol{w})|\boldsymbol{\theta}]$ like logistic regression, can be applied to learn on these extracted features, and output calibrated probabilities. We call this method post-calibration, meaning post-processing the output of the original model to produce well-calibrated probabilities.

Why does this post-calibration idea work? Why do those original models (even probabilistic) fail to produce well-calibrated probabilities? A recent paper[^5] gives an explanation. If we assume there exist a "true distribution", then this true distribution is well-calibrated by nature. Once our probabilistic model successfully learns that true distribution, then our learnt distribution will also be well-calibrated. However, that's not the case. Our model may get over-fitting to the training set. The more complicated our model, like deep neural networks, the more possible it is to get over-fitting. Another reason could be that the feature space and/or the landscape of the loss function are too complex that our learning model may be trapped in local optima, during optimisation. Because of these, our model (even probabilistic) usually learns an approximate distribution far away from the true distribution, and thus produces uncalibrated probabilities. Post-calibration techniques use simple probabilistic models, such as logistic regression, or one-layer probabilistic neural networks to learn from a simple feature space, which is the original output of the model, such as scores of an SVM model, or uncalibrated probabilities of a deep probabilistic neural network. 

When using post-calibration methods, we should have at least 3 datasets for training $(\boldsymbol{X_{train}}, y_{train})$, calibration $(f(\boldsymbol{X_{cal}}|\boldsymbol{w}), y_{cal})$, and testing $(\boldsymbol{X_{test}}, y_{test})$. We train the original model on the training set, and train a calibrator on the calibration set, and evaluate the performance, including how accurate the prediction is and how well-calibrated the probabilities on the test set.

How do we check if a forecast distribution is well-calibrated? In the last section, we decomposed the Brier Score into the calibration term and refinement term. In theory, the calibration term $C = \frac{1}{K}\sum_{j=1}^K n_j(p_j - r_j)^2$ can serve as a metric. Yet there are practical difficulties. The calibration term requires to group events by its exact probability $p_j$, and compute the relative frequency of these $n_j$ events. This requires the $n_j$ to be big enough for every unique probability value $p_j$ to produce a frequency value of statistical significance. But it is rare in practice. Mostly we have events whose probability value $p_j$ occurs only once, and the corresponding $n_j$ equals 1, where it is impossible to calculate a meaningful frequency value. As a compromise, we sometimes use directly the Brier Score to evaluate probability calibration. Or we make some relaxation to the grouping criteria, not to group events by their *exact* probabilities, but *similar* probabilities, so that each group can have enough events to calculate a meaningful frequency. This is how the widely used ECE(Expected Calibration Error)[^6]works. 
$$
ECE = \frac{1}{n}\sum_i^n |pr_i - fr_i|
$$
where $pr_i$ represents the average probability of the $i$th group and $fr_i$ represents the relative frequency of the $i$th group. Here is a naive example:
$$
P = [(0.11,0.12,0.13,0.14,0.15), (0.81,0.82,0.83,0.84,0.85)]
$$
$$
Y = [(0,0,0,0,1), (1,1,1,1,0)]
$$
$$
ECE = \frac{1}{2} (|0.13-0.2| + |0.83-0.8|)=0.10
$$

In this example, there are only events whose predicted probability value occurs only once. We group the events with close probabilities into 2 clusters, and calculate the average probabilities and relative frequencies of these 2 clusters, and compare the cumulative distances, which is $0.10$, a relatively small and satisfying results.

## Theoretical Benefits

Well-calibrated probabilities are beneficial, especially for critical applications that rely on accurate probabilities, such as healthcare diagnosis.

The most important benefit of distribution calibration should be **Accurate Loss Estimation**[^7]: for Bayesian decision tasks, the simulated loss computed by the predicted distribution equals the true loss computed by the true distribution. That is to say, with well-calibrated predicted probabilities, the downstream decision makers can accurately estimate the loss as if they have the true probabilities. In other words, the calibrated probabilities are indistinguishable in terms of loss estimation for downstream makers.

Formally, we consider the binary classification problem with feature data $X \in \mathbb{R}^m$ and label data $Y \in \{0,1\}$. A probabilistic predictor takes $X$ as input and produces a probability value $\hat{p}: X \rightarrow [0,1]$. Here we denote $\hat{p}(X)$ as the predicted distribution and $p^*(X)$ as the true distribution. We assume a downstream application can be formalised as a decision making problem written in the form of loss minimisation with a loss function $\mathcal{\ell}$ and the corresponding action space $\mathcal{A}$: $\mathcal{\ell}: Y \times \mathcal{A} \rightarrow \mathbb{R}$. If the decision making task is Bayes Decision, then we can define the decision function as 
$$
\delta_{\mathcal{\ell}}(\hat{p}(X)) = \mathop{\arg\inf}_{a \in \mathcal{A}}\mathbb{E}_{\hat{Y} \sim \hat{p}(X)}[\mathcal{\ell}(\hat{Y}, a)]
$$

If our predictor $\hat{p}$ achieves distribution calibration, meaning $\mathbb{E}[Y|\hat{p}(X)=\beta]=\beta$, then we have Accurate Loss Estimation[^7]:

$$
\mathbb{E}_ {X} \mathbb{E}_{\hat{Y} \sim \hat{p}(X)} [\mathcal{\ell}(\hat{Y}, \delta_{\mathcal{\ell}}(\hat{p}(X)))] = 
\mathbb{E}_X\mathbb{E}_{Y \sim p^*(X)} [\mathcal{\ell}(Y, \delta_{\mathcal{\ell}}(\hat{p}(X)))]
$$

This important property ensures that the decision maker can know the expected loss incurred over the distribution of individuals in advance and prepare for it.

The concept of distribution calibration can be extended to multi-class classification, and it it has the property of Accurate Loss Estimation. We can define label data as $Y \in \{0, 1, ..., K\}$, the predicted distribution as $\hat{p}: X \rightarrow \Delta^C$ where $\Delta^C$ is a C-dimension simplex, and the criterion of distribution calibration becomes $\forall\beta \in \Delta^C \quad \mathbb{E}[Y|\hat{p}(X)=\beta]=\beta$. 


## Conclusion
In this note, I explained the notion of probability calibration in the aspect of its origin, its mechanism, and its benefits. This notion originated from a philosophical inquiry of an epistemic virtue for partial beliefs analogous to the virtue of truth for full beliefs, and calibration is the epistemic virtue we wanted. Then we briefly introduced a family of techniques called post-calibration in Machine Learning, and explained how and why they work. In the final section, I revealed the most important benefit of probability calibration: Accurate Loss Estimation. If our predicted distribution is well-calibrated, then it ensures that we can accurately estimate the loss as if we have the true distribution in Bayesian decision making tasks.



[^1]: Fraassen, B. C. V. (1983). Calibration: A frequency justification for personal probability. In *Physics, philosophy and psychoanalysis* (pp. 295-319). Springer, Dordrecht.
[^2]: Hoefer, Carl. (2012). Calibration: Being in tune with frequencies. dialectica, 66(3):435
[^3]: Platt, John et al. (1999). Probabilistic outputs for support vector machines and comparisons to regularized likelihood methods. Advances in large margin classifiers, 10(3):6
[^4]: Rahimi, A., Gupta, K., Ajanthan, T., Mensink, T., Sminchisescu, C., & Hartley, R. (2020). Post-hoc calibration of neural networks. *arXiv preprint arXiv:2006.12807*.
[^5]:  Guo, Chuan, Pleiss, Geoff, Sun, Yu and Weinberger, Kilian Q. (2017). On calibration of modern neural networks. In International Conference on Machine Learning, pages 1321–13
[^6]: Naeini, Mahdi Pakdaman, Cooper, Gregory and Hauskrecht, Milos. (2015). Obtaining well cal- ibrated probabilities using bayesian binning. In Twenty-Ninth AAAI Conference on Artificial In- telligence

[^7]: Zhao, S., Kim, M., Sahoo, R., Ma, T., & Ermon, S. (2021). Calibrating predictions to decisions: A novel approach to multi-class calibration. *Advances in Neural Information Processing Systems*, *34*, 22313-22324.









