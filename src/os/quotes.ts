export const RickLines = {
  boot: [
    'Wubba Lubba Dub Dub!!',
    "I don't take requests.",
    'Existence is pain, Mrs. Meeseeks.',
    "I'm not crying, it's just been raining on my face.",
    'Yeah, sure, I mean, if you spend all day shuffling words around, you can make anything sound bad, Morty.',
    "Nobody exists on purpose. Nobody belongs anywhere. Everybody's gonna die.",
    "It's not about where you are, it's about who you're with.",
    "You're not smarter than me, Morty. You're not even as smart as a paperclip.",
  ],
  greetings: [
    'Oh boy, here I go killing again!',
    "Welcome to C-137. Don't touch anything.",
    "Th-th-th-that's right, Morty, welcome to my dimension.",
    "Ah geez, you're in Rick's dimension now.",
    "Aww, jeez, here we go again, Morty.",
  ],
  errors: [
    "That's a bummer, Morty. Even for an error.",
    'Geez, how do you even manage to break that, Morty?',
    'This is way beyond your capabilities, Morty.',
    "I knew this was a bad idea. And I'm usually all about ideas.",
  ],
  success: [
    'Boom, Morty! Science wins again!',
    "That's genius, Morty. Even by my standards.",
    'See? Wubba lubba dub dub!',
    "That's how you do it, Morty. That's how science is done.",
    "Aw, jeez, that actually worked. I'm as surprised as you are.",
  ],
};

export const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const rickQuote = () => rand(RickLines.boot);
export const rickGreeting = () => rand(RickLines.greetings);
export const rickError = () => rand(RickLines.errors);