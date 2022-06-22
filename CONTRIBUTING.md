# Contributing

We like external contributions! Every internal contributor started as an external contributor.
(Except the founder, of course.)

Our contributors vary in experience. Many of our contributors have very little software development
experience, but a great understanding of the game, and some have over 30 years of software industry
experience. Wherever you fit in that level of experience, your contribution is welcome.

Before taking on a substantial amout of work for your favorite feature, please first discuss the
change you wish to make via issue, email, Discord, or any other method with the owners of this
repository.

Our codebase is growing and changing all the time, and with each change we ask ourselves if it
introduces too much risk, resource consumption or unclear code. All of this is to make sure the
project remains nimble and easy to maintain, enhance and understand. This is why we adhere to
some degree of quality and standards and comprehension, so please do not be surprised if our
first response is to ask for clarification or possibly significant changes. We commit to
respectfully working with you to ensure your change can be accepted, and also, that it be
clear, correct, and well-tested.

## Unit Tests

We care that our project is correct, and that means testing, and unit tests are our best way of ensuring that future changes don’t break existing behavior.

While some small changes can be made without unit tests, larger, or more fundamental changes will need them. Rather than write an exhaustive list here, be confident that your reviewer will guide you as to what tests you need.

If you both agree that the code doesn't need any tests, don't be surprised if your reviewer asks, "How do you know this is correct?"

## Readability

The code needs to be readable as well as correct. Far too often we have reviewed code from just a few months before, where a regular contributor has since disappeared, and nobody understands what it does. So before sending  PR for review, consider these things: _Is your code structured well? Do comments explain the tricky parts? Do variable names make sense? If you weren’t around to maintain the change, would someone else understand?_

If these things seem difficult, just ask us for help, even if your code is in a partially-completed state.

## If your change is declined

Once in a while the group will decide that it doesn’t make sense to include a particular feature or change. This is why we’d prefer you contact us before spending all that time writing a feature! We commit to giving a clear reason why we are declining a feature. While not ideal, remember that you can fork the repo and host your own copy of the game.

## Technical Considerations
### Technical Compatibility

We endeavor to have this app run on home Windows, Linux, Mac computers, and support modern popular browsers (sorry, IE11) so any changes that might seem browser / platform specific may get extra scrutiny.

### Managing resource consumption

This project is designed to run on single node servers or locally. Any change should consider the impact on the setup required for local users and the performance impact on a single node server. Your change might cause a significant consumption increase in memory, disk or CPU. You may be asked to make changes in response to that.

## Questions?

[Post an issue](https://github.com/bafolts/terraforming-mars/issues/new) or [Find us on Discord](https://discord.gg/VR8TbrD)
