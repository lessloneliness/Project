import nlp from 'compromise';

export const calculateMatch = (myBio, friendBio, Myhobbies, freindHobbies) => {
  let match = 0;

  const mySubjects = getRelevantWords(myBio);
  const friendSubjects = getRelevantWords(friendBio);

  if (mySubjects.length && friendSubjects.length) {
    const countSameSubjects = mySubjects.filter((subject) =>
      friendSubjects.includes(subject)
    ).length;
    match += (countSameSubjects / mySubjects.length) * 0.3;
  }

  if (Myhobbies.length && freindHobbies.length) {
    const myHobbiesNames = Myhobbies.map((hobby) => hobby.item);
    const freindHobbiesNames = freindHobbies.map((hobby) => hobby.item);
    const countSameHobbies = myHobbiesNames.filter((myHobby) =>
      freindHobbiesNames.includes(myHobby)
    ).length;
    match += (countSameHobbies / myHobbiesNames.length) * 0.7;
  }

  return match;
};

const filterWords = (originalArray, words) => {
  return originalArray.filter((word) => !words.includes(word));
};

const getRelevantWords = (bio) => {
  let sentence = bio.toLowerCase();

  let contractions = nlp(sentence); //הרחבת קיצורים
  contractions.contractions().expand();

  sentence = contractions.text();

  sentence = nlp(sentence).sentences().toPresentTense().text(); //הפיכת המשפט להווה

  const adverbs = nlp(sentence).adverbs().out('array'); //תואר הפועל
  const adjectives = nlp(sentence).adjectives().out('array'); //שמות תואר
  const pronouns = nlp(sentence).pronouns().out('array'); //כינויים
  const conjunctions = nlp(sentence).conjunctions().out('array'); //מילות קישור
  const prepositions = nlp(sentence).prepositions().out('array'); //מילות יחס
  const abbreviations = nlp(sentence).abbreviations().out('array'); //קיצורים
  const nounsAdjectives = nlp(sentence).nouns().adjectives().out('array'); //שמות תואר לעצמים

  const ignoreWords = Array.prototype.concat.apply(
    [],
    [
      adverbs,
      adjectives,
      pronouns,
      conjunctions,
      prepositions,
      abbreviations,
      nounsAdjectives,
      ['is', 'are', 'my', 'am', 'i'],
    ]
  );

  let sentenceWords = sentence.split(' ');

  sentenceWords = filterWords(sentenceWords, ignoreWords);

  const newSentence = sentenceWords.join(' ');

  const nouns = nlp(newSentence).match('#Noun').out('array'); //עצמים
  const verbs = nlp(newSentence).match('#Verb').out('array'); //פעלים

  return Array.from(
    new Set([...nouns, ...verbs].map((word) => word.replace(',', '')))
  );
};
