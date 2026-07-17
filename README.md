# MSG (The Mecca, In App Form)

The world's most famous arena, now living in your pocket. MSG is a New York
Knicks shrine built as a real full stack app. **Next.js** up front,
**FastAPI** in the back, and pure blue and orange faith all the way through.
Made by a fan, for fans, and for anyone who ever asked a Knicks fan "why do you
do this to yourself." The answer lives in **The Faith**.

Celebrating the **2026 NBA Champions**. First banner since '73, Brunson Finals
MVP, the first NBA Cup and title double in league history. Bing bong.

## What's inside

**MSG Hoops** is the main event. Drag the ball back and let it fly, arc it
through the rim, and try to beat your rival before the clock hits zero. Swish
one dead center for a green PERFECT and double points. Stack a combo, cash in
the gold bonus windows, and watch the rim start sliding once you get hot. Every
make earns coins and XP, so you climb levels, chase achievements, unlock new
basketballs in the Locker, and hit the daily challenge. Slow motion kicks in on
buzzer beaters. It all lives on a Garden court with banners in the rafters and
the real crowd roaring.

**Beat the Buzzer** is rapid fire trivia against a sixty second clock. No time
to think, just drain as many buckets as you can before the horn.

**The Gauntlet** is ten questions across the '26 chip, deep history, fanbase
lore, and premium shade. A real shot clock ticks on every answer. Wrong ones
get roasted. Ranks climb from Tourist at the Garden to Banner Raiser.

**Fact Roulette** is one button and eighty years of material. Press it, get a
Knicks fact. Rare pulls rain a Knicks colored confetti storm and the streak
text gets louder the longer you keep going.

**Rage Bait Machine** serves hot takes engineered to end group chats, like "the
25 and 26 Knicks sweep the 73 and 9 Warriors and it is only close for a half."
Each one comes with a certified rage level and a count of rival fans who hated
it. If you catch feelings, that is on you.

**Trash Talk Generator** lets you pick any rival in the league, Celtics, Nets,
Heat, Bulls, Lakers, all of them, and receive ammunition. Roasting the marquee
franchises rattles the whole building.

**The Faith** is the sincere one. A timeline from 1946 all the way to the
parade. Show it to somebody who does not get it yet.

**Championship '26** relives the Finals run game by game, from the Game 1 dagger
to the Canyon of Heroes. Drop your own photos into `frontend/public/photos/`
and they join the gallery on the home screen automatically.

## Run it

You need **Node.js** and **Python 3**. No Docker required.

First time, install the dependencies.

```bash
cd frontend && npm install && cd ..
pip install -r backend/requirements.txt
```

Then start both servers with one command. Backend runs on `:8000`, frontend on
`:3000`.

```bash
./dev.sh
```

Open **http://localhost:3000** and step inside. Go NY go NY go.
