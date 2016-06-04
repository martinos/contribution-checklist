
# Expectations

Issues and pull requests require patience.

The workflow around Elm is optimized for throughput, not latency. This means certain requests may take longer, but overall, work is completed more quickly.

Here is why:

  - [Work on Elm projects is batched.](#batching)
  - [Elm values holistic design.](#holistic-design)


### Batching

Work on Elm projects is batched.

To do great work on a compiler, you really need to get deeply immersed in the problems people face and the details of the code. The same is true for a package manager. Or for a REPL. Or for documentation. Now the problem is:

  1. One cannot be deeply immersed in all of these projects at the same time.
  2. Switching between projects can take a few days.

Because of this, it makes sense to batch work on each project. Focus intensely on one thing at a time. This means that a &ldquo;simple&rdquo; issue on `elm-lang/core` may be blocked by ongoing work on `elm-package`.


### Holistic Design

&ldquo;Simple&rdquo; issues are often much more interconnected than you think.

Imagine there are 20 suggestions on how to make something better. Taken *individually*, each one is probably pretty easy to deal with. Taken *together*, you are talking about quite serious design changes. Does that design have a coherent vision? Is it directed at the needs of your intended users? Do all the parts fit together? Can you find a simpler design that addresses all 20 suggestions in a nicer way?

One of the big benefits of batching work is that the review process is *structured* for holistic design. By allowing time for folks to share their experiences and suggestions, it becomes possible to consider them all together and better balance their needs. Shifting towards real-time responses on everything would *necessarily* degrade the overall design quality.


## An Example

I think [this issue](https://github.com/elm-lang/elm-package/pull/177) shows what batching and holistic design mean in practice.

It took about a week to revamp all the error messages for `elm-package`, ultimately leading to the fix in this case. Should [Elm 0.17](http://elm-lang.org/blog/farewell-to-frp) have blocked for an extra week for this? Is it smart to have so many changes in a single release? Do these changes fit into the overall narative of the release?

In the year 2017 or 2030, users will only know if things are nice or if they suck. January or July of 2016 makes no difference to them. So waiting a few months feels like a long time to us, but it is not about us!

When a project is going to live for decades, it is better to do things *right* than to do things *right now*.
