// Text content for different practice modes

const BEGINNER_WORDS = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
  'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
  'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
  'its', 'let', 'put', 'say', 'she', 'too', 'use', 'big', 'go', 'do',
  'my', 'no', 'so', 'up', 'us', 'we', 'an', 'as', 'at', 'by', 'he',
  'if', 'in', 'is', 'it', 'of', 'on', 'or', 'to', 'be', 'me',
  'cat', 'dog', 'run', 'sit', 'top', 'hot', 'sun', 'fun', 'red', 'bed',
  'cup', 'cut', 'bus', 'bug', 'hug', 'jug', 'mud', 'bud', 'dug', 'rug',
];

const BEGINNER_SENTENCES = [
  'the cat sat on the mat and the dog ran to the door',
  'it is a big day for all of us and we can do it',
  'she has a red cup and he has a blue one too',
  'the sun is hot but the fun is not done yet',
  'go and get the bag from the top of the bed',
  'he can run and she can too but we did not see it',
  'the old man sat by the bus and did not get up',
  'all of us can see the big red bus go by now',
  'put the cup on top and let the dog sit by you',
  'it was a new day and we all got up to say hi',
  'the boy ran to get his dog and the cat did not run',
  'you can sit and use the big red cup if you want',
];

const INTERMEDIATE_SENTENCES = [
  'The quick brown fox jumps over the lazy dog near the old farm house.',
  'Learning to type faster requires consistent daily practice and patience.',
  'Technology has changed the way people communicate and work together.',
  'A good typist can maintain high accuracy while increasing their speed.',
  'The morning sun cast long shadows across the empty city streets.',
  'She decided to improve her typing skills by practicing every single day.',
  'Reading books regularly helps expand your vocabulary and knowledge base.',
  'The team worked together to complete the project before the deadline.',
  'Practice makes perfect when it comes to developing any new skill.',
  'Every keystroke brings you closer to becoming a faster and better typist.',
  'The conference room was quiet as everyone focused on their work.',
  'He typed the entire report without looking at the keyboard once.',
  'Consistent effort over time always leads to measurable improvement.',
  'The software update included many new features that users requested.',
  'Good typing posture helps prevent fatigue during long working sessions.',
  'The deadline was approaching but the team felt confident in their progress.',
  'She sent a quick message to let him know the meeting was moved.',
  'Building good habits takes time but the results are always worth it.',
  'The report was due on Friday and everyone worked hard to finish it.',
  'He kept his fingers on the home row keys as his teacher had shown him.',
];

const ADVANCED_SENTENCES = [
  'In the rapidly evolving landscape of modern technology, adaptability and continuous learning have become indispensable qualities for professionals across virtually every industry.',
  'The phenomenon of cognitive dissonance occurs when a person simultaneously holds contradictory beliefs, resulting in psychological discomfort that motivates behavioral or attitudinal change.',
  'Extraordinary achievements are invariably preceded by extraordinary preparation; success rarely materializes spontaneously but is instead the culmination of disciplined, purposeful effort.',
  'The unprecedented proliferation of digital communication platforms has fundamentally transformed the nature of interpersonal relationships, professional collaboration, and information dissemination.',
  'A steady typing session gives your hands time to find a comfortable rhythm. Keep your eyes on the next few words, let each finger reach its key, and pause briefly when you need to reset your posture.',
  'The intricate interplay between environmental factors and genetic predispositions continues to challenge researchers attempting to understand the complex origins of human behavior.',
  'Contemporary organizational management theories emphasize the importance of psychological safety, distributed leadership, and inclusive decision-making in fostering innovation.',
  'The philosophical question of whether human consciousness can ever be fully replicated in artificial systems remains one of the most fascinating and contentious debates in modern science.',
  'Quantitative analysis of longitudinal datasets revealed statistically significant correlations between socioeconomic factors and educational outcomes across demographic groups.',
  'The extraordinary diversity of human languages, each with its own unique grammatical structures and phonological systems, presents both challenges and opportunities for computational linguistics.',
];

const DIFFICULT_WORDS = [
  'necessary', 'separate', 'environment', 'development', 'experience',
  'government', 'especially', 'beautiful', 'different', 'technology',
  'immediately', 'particularly', 'opportunity', 'responsibility', 'professional',
  'ということ', 'accidentally', 'approximately', 'approximately', 'Mediterranean',
  'lieutenant', 'millennium', 'conscientious', 'entrepreneur', 'surveillance',
  'bureaucratic', 'pharmaceutical', 'infrastructure', 'perpendicular', 'exaggerate',
  'maintenance', 'questionnaire', 'embarrassment', 'accommodation', 'acquisition',
  'disappearance', 'recommendations', 'miscellaneous', 'correspondence', 'circumstances',
  'appropriate', 'curriculum', 'unnecessary', 'occasionally', 'pronunciation',
];

const NUMBERS_CONTENT = [
  '2026 1984 3.14159 42 100 255 1024 65536 0 999',
  '14.75 98.6 2.718 1.618 3.14 0.001 100.00 50.5 33.3 66.7',
  '12/09/2026 01/01/2024 31/12/1999 15/06/2000 28/02/2023',
  '98% 75% 100% 42% 3.14% 0.5% 99.9% 50% 25% 12.5%',
  '1,000 10,000 100,000 1,000,000 2,500 7,890 3,456 12,345',
  '2026 404 200 500 8080 3000 443 80 22 21',
  '$14.99 $100.00 $3.50 $999.95 $0.99 $49.99 $1,299 $24.99',
  '1st 2nd 3rd 4th 10th 21st 33rd 100th 42nd 5th',
  '3.14159 2.71828 1.41421 1.73205 0.30103 1.57080',
  '100 200 300 400 500 600 700 800 900 1000 1100 1200',
];

const SPECIAL_CHARS_CONTENT = [
  '! @ # $ % ^ & * ( ) _ + = [ ] { } ; : \' " , . / ?',
  'Hello! How are you? I\'m fine, thanks. What about you?',
  'email@example.com user_name@domain.org test+filter@mail.com',
  'function(x) { return x * 2; } // multiply by 2',
  'price: $49.99 | discount: 20% | total: $39.99',
  '#hashtag @mention [brackets] {braces} (parentheses)',
  'a+b=c x*y/z a^2+b^2=c^2 f(x)=2x+1 g(x)=x^2-4',
  'http://example.com/path?query=value&key=test#anchor',
  '/* comment */ <!-- html --> // line comment # python comment',
  'git@github.com:user/repo.git ssh://user@host:22/path',
];

const PROGRAMMING_SNIPPETS = [
  'const user = { name: "developer", role: "admin" };\nconsole.log(user.name);',
  'function calculateWPM(chars, minutes) {\n  return Math.round((chars / 5) / minutes);\n}',
  'const [count, setCount] = useState(0);\nuseEffect(() => { document.title = count; }, [count]);',
  'import React, { useState, useEffect } from "react";\nimport { createRoot } from "react-dom/client";',
  'const filtered = array.filter(item => item.active);\nconst mapped = filtered.map(item => item.value);',
  'async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}',
  'class TypeFlow extends Component {\n  constructor(props) {\n    super(props);\n  }\n}',
  'const router = createBrowserRouter([\n  { path: "/", element: <Home /> },\n]);',
  '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
  '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
  'SELECT id, name, email FROM users WHERE active = 1 ORDER BY name ASC;',
  'const sum = arr.reduce((acc, val) => acc + val, 0);\nreturn sum / arr.length;',
  'type User = {\n  id: number;\n  name: string;\n  email: string;\n};',
  'git commit -m "feat: add typing speed calculator"\ngit push origin main',
  'npm install react react-dom vite\nnpm run dev\nnpm run build',
];

const SPEED_CHALLENGE_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'any',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWordText(words, count = 50) {
  const shuffled = shuffle(words);
  const result = [];
  while (result.length < count) {
    result.push(...shuffled);
  }
  return result.slice(0, count).join(' ');
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSentenceText(sentences, targetLength = 300) {
  let text = '';
  const shuffled = shuffle(sentences);
  let i = 0;
  while (text.length < targetLength) {
    text += (text ? ' ' : '') + shuffled[i % shuffled.length];
    i++;
  }
  return text;
}

export function generateText(mode, duration = 60) {
  // Target character count based on duration (assuming ~60 WPM = 300 chars/min)
  const targetChars = Math.max(300, Math.round((duration / 60) * 300 * 1.5));

  switch (mode) {
    case 'beginner':
      return generateSentenceText(BEGINNER_SENTENCES, targetChars);

    case 'intermediate':
      return generateSentenceText(INTERMEDIATE_SENTENCES, targetChars);

    case 'advanced':
      return generateSentenceText(ADVANCED_SENTENCES, targetChars);

    case 'speed':
      return generateWordText(SPEED_CHALLENGE_WORDS, Math.max(60, Math.round(duration * 1.5)));

    case 'accuracy':
      return generateSentenceText(INTERMEDIATE_SENTENCES, targetChars);

    case 'difficult':
      return generateWordText(DIFFICULT_WORDS, Math.max(40, Math.round(duration)));

    case 'numbers':
      return generateSentenceText(NUMBERS_CONTENT, targetChars);

    case 'special':
      return generateSentenceText(SPECIAL_CHARS_CONTENT, targetChars);

    case 'programming': {
      let code = '';
      const snippets = shuffle(PROGRAMMING_SNIPPETS);
      let i = 0;
      while (code.length < targetChars) {
        code += (code ? '\n' : '') + snippets[i % snippets.length];
        i++;
      }
      return code;
    }

    default:
      return generateSentenceText(INTERMEDIATE_SENTENCES, targetChars);
  }
}

export function getModeName(mode) {
  const names = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    speed: 'Speed Challenge',
    accuracy: 'Accuracy Challenge',
    difficult: 'Difficult Words',
    numbers: 'Numbers',
    special: 'Special Characters',
    programming: 'Programming',
  };
  return names[mode] || 'Intermediate';
}
