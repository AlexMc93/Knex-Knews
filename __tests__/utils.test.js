const { createLookup, changeTimeFormat, formatComments } = require('../db/utils/data-manipulation');

describe('createLookup', () => {
  it('Returns empty object when passed no value', () => {
    expect(createLookup([])).toEqual({});
  });
  it('Returns the data given as a lookup object', () => {
    expect(
      createLookup(
        [
          {
            a: 1,
            b: 2,
            c: 3,
          },
        ],
        'a',
        'b'
      )
    ).toEqual({ 1: 2 });
  });
  it('Returns the data given when passed multiple objects', () => {
    expect(
      createLookup(
        [
          {
            a: 1,
            b: 2,
            c: 3,
          },
          {
            a: 10,
            b: 35,
            c: 60,
          },
        ],
        'a',
        'b'
      )
    ).toEqual({ 1: 2, 10: 35 });
  });
});

describe('changeTimeFormat', () => {
  it('Returns a new empty array when passed an empty array', () => {
    const input = [];
    expect(changeTimeFormat(input)).toEqual([]);
    expect(changeTimeFormat(input)).not.toBe(input);
  });
  it('Returns new objects without mutating original', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ];
    const expected = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ]
    changeTimeFormat(input);
    expect(input).toEqual(expected);
    expect(changeTimeFormat(input)[0]).not.toBe(input[0]);
  });
  it('Returns a formatted object (changed timestamp) when passed a single object', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }
    ];
    const newTime = new Date(input[0].created_at);
    const expected = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: newTime
      }
    ]
    expect(changeTimeFormat(input)[0]).toEqual(expected[0]);
  });
  it('Returns all objects formatted when passed multiple objects', () => {
    const input = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
      {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256,
      }
    ];
    const newTime0 = new Date(input[0].created_at);
    const newTime1 = new Date(input[1].created_at);
    const expected = [
      {
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: newTime0,
      },
      {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'coding',
        author: 'jessjelly',
        body:
          'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: newTime1,
      }
    ];
    expect(changeTimeFormat(input)).toEqual(expected);
  });
});

describe('formatComments', () => {
  it('Returns an empty array if passed empty array', () => {
    const input = [];
    expect(formatComments(input, {})).toEqual([]);
    expect(formatComments(input, {})).not.toBe(input);
  });
  it('Returns new objects without mutating the originals', () => {
    const input = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }
    ];
    const expected = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }
    ];
    const lookup = createLookup('belongs_to', 1)
    formatComments(input, lookup);
    expect(input).toEqual(expected);
    expect(formatComments(input, lookup)[0]).not.toBe(input[0]);
  });
  it('Returns a formatted object (article_id instead of belongs_to, author instead of created_by)', () => {
    const input = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }
    ];
    const lookup = {'The People Tracking Every Touch, Pass And Tackle in the World Cup': 1};
    const expected = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        article_id: 1,
        author: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }
    ];
    expect(formatComments(input, lookup)).toEqual(expected);
  });
});