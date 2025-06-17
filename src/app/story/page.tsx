'use client';

import { useState } from 'react';

export default function VexVoidLore() {
  const [currentChapter, setCurrentChapter] = useState(0);

  const chapters = [
    {
      title: "ORIGINS: BORNEO TO CAMDEN",
      content: `Born in Seria, Brunei, on the island of Borneo in 1978, Vex was uprooted at a young age and transplanted to the gritty streets of Camden Town, London. The culture shock was immediate - from the tropical isolation of Southeast Asia to the raw, unfiltered energy of North London's underground scene.

Camden in the 90s was a breeding ground for alternative culture. Market stalls selling bootleg vinyl, punks with mohawks, and the constant hum of rebellion in the air. For a young immigrant kid from Borneo, it was both overwhelming and intoxicating.

This early displacement would become a recurring theme - always the outsider, always moving, always searching for that elusive sense of belonging that would only come through art, sound, and later, substances that promised transcendence.

Even from the beginning, Vex was trouble. The kind of kid who caused problems, who couldn't sit still, who was drawn to the edges where things got messy and real.`,
      atmosphere: "🌴 Borneo to Camden"
    },
    {
      title: "HOXTON SQUARE: THE AWAKENING",
      content: `The late 90s. Hoxton Square Blue Note was where everything clicked for Vex. This was ground zero for London's underground electronic scene - the place where Ninja Tune Records artists would showcase their latest experiments alongside the Mo Wax Records crew.

The first time Vex witnessed four-deck mixing, watching the Ninja Tune crowd work their magic alongside James Lavelle and UNKLE, the whole trip-hop revolution unfolding in real time - this was where the boundaries between DJ and producer, between curator and creator, completely dissolved.

Working at Ninja Tune Records, Vex absorbed the ethos of underground culture: anti-commercial, pro-innovation, always pushing boundaries. He witnessed firsthand how artists like Coldcut, DJ Food, Amon Tobin, DJ Krush, and DJ Shadow crafted their signature sounds - each track a perfect fusion of sampling mastery and sonic innovation.

*"Music isn't just sound - it's a complete sensory experience."* - A lesson that would define his entire artistic journey.

The label's creative ecosystem taught him the art of curation, the importance of sonic aesthetics, and the philosophy of music as resistance. But it was the live experience at Hoxton that showed him what was possible when all elements aligned.`,
      atmosphere: "🥷 Hoxton Square Era"
    },
    {
      title: "BIRMINGHAM: STREET ART & BEATS (2000-2001)",
      content: `Moving to Birmingham in 2000 to study visual graphics, Vex discovered two cultures that would shape his aesthetic forever: street art and skateboarding. The industrial landscape of Birmingham provided the perfect canvas for both.

The city's abandoned factories and concrete underpasses became his gallery. By night, he'd bomb walls with intricate pieces that blended Eastern calligraphy with Western graffiti styles. By day, he'd skate the same spots, seeing the city from new angles, understanding how movement and space interact.

It was here that drum and bass captured his soul. First through the early jungle pioneers - Shy FX, Dillinger - their raw, uncompromising sound matching the urban decay around him. The breakbeats matched the rhythm of wheels on concrete, the bass drops synchronized with the adrenaline rush of landing a trick or completing a piece without getting caught.

Metalheadz became his obsession. The label's sophisticated approach to drum and bass - Goldie's artistic vision, the technical precision, the way they elevated the genre from underground rave music to something approaching high art - this was the template for everything Vex would later attempt with his own work.

Two years of pure immersion in Birmingham's underground culture, before the next phase of his journey would call.`,
      atmosphere: "🎨 Birmingham Awakening"
    },
    {
      title: "NORTHERN STUDIES: FINE ART & PHILOSOPHY",
      content: `The move north to study fine art and painting marked a philosophical shift. Here, in the austere beauty of northern England, Vex encountered the classical traditions he'd been rebelling against.

Oil painting, color theory, art history - all the formal structures he'd previously rejected. But rather than abandon his street roots, he began to synthesize: spray paint techniques applied to canvas, urban decay aesthetics in gallery spaces, the raw energy of drum and bass translated into visual rhythm.

His tutors were baffled by his hybrid approach, but Vex was beginning to understand something crucial: authenticity comes not from purity, but from honest synthesis. The collision of high and low culture, East and West, street and gallery - this tension would become his signature.

Late nights in the studio, surrounded by half-finished paintings and sketches, he'd play ambient techno and let the sounds guide his brush. Art and music were becoming inseparable.

After a year of academic exploration, the pull of London's underground scene became irresistible once again.`,
      atmosphere: "🎨 Academic Synthesis"
    },
    {
      title: "LONDON SQUATS: THE UNDERGROUND YEARS",
      content: `Back in London, Vex dove headfirst into the squat scene. Abandoned buildings in Hackney, Elephant & Castle, South London - these became his universities, his galleries, his concert halls.

The squat rave culture of early 2000s London was unlike anything before or since. Massive sound systems in derelict warehouses, VJs projecting onto crumbling walls, a community bound by shared rejection of mainstream society.

For years, Vex lived this nomadic existence: sleeping on floors, carrying his equipment from squat to squat, performing at illegal parties that would be shut down by dawn. The constant threat of eviction, the DIY ethos, the communal creativity - it was raw, unfiltered, and absolutely formative.

His music evolved in this environment: harder, more experimental, designed for sound systems that could shake concrete foundations. His visuals became more abstract, more psychedelic, crafted for audiences altered by substances and sleep deprivation.

*"We weren't making art for galleries or labels - we were creating temporary autonomous zones where anything was possible."*

This underground education would prove invaluable, but eventually the need for new perspectives would drive him south to the coast.`,
      atmosphere: "🏠 Squat Life"
    },
    {
      title: "BRIGHTON: DIGITAL AWAKENING",
      content: `Brighton's digital media program introduced Vex to the tools that would define the next phase of his journey. HTML, Flash, early video editing software - the digital realm offered infinite possibilities for the multimedia visions brewing in his mind.

The seaside town's creative community embraced experimentation. Beach parties with laptop DJs, projection mapping onto Victorian architecture, early internet art collectives - Brighton was where the analog and digital worlds collided.

Vex began creating his first audio-visual pieces: grainy video loops synchronized to his own electronic compositions, interactive installations that responded to movement and sound. The techniques he'd learned at Ninja Tune, combined with his visual arts background, finally had an outlet.

But the academic environment felt increasingly constraining. The real education was happening in the underground - illegal beach raves, warehouse parties, the emerging free party scene.

As his skills developed and his vision expanded, the call of international adventure grew stronger. Japan beckoned with its legendary club culture and technological innovation.`,
      atmosphere: "💻 Digital Fusion"
    },
    {
      title: "TOKYO: FETISH NIGHTS & FILM CREWS",
      content: `The move to Tokyo represented a complete cultural reset. This was where Vex found his true element - not just Japan's club scene, but the underground fetish circuit. Torture Garden nights, Tokyo Decadence, The Gate - these were his venues. The "almost a sex party" parties where art, performance, and transgression blurred into one intoxicating experience.

His sweet spot was the sophisticated debauchery: exclusive guest-only places in Ginza with chandeliers and madams, the Trump Room's theatrical excess, circus nights that pushed every boundary. Working as an editor in Tokyo's porn industry wasn't just about money - it was about living at the intersection of art and extremity.

It was in his local neighborhood bar, surrounded by modular synth music and late-night drinking sessions, that Vex met the French filmmakers who were shooting in Tokyo. These Parisian directors, working on their psychedelic masterpiece about consciousness and death, became his drinking companions and creative collaborators. All-night sessions discussing cinema, consciousness, and the void.

But Vex was making problems. Always the troublemaker, always pushing boundaries too far. Drug habits spiraling, relationships combusting, burning bridges with clubs and collaborators alike. Tokyo's 24-hour fetish culture enabled his worst tendencies - the constant availability of stimulation, substances, and sexual excess.

The city's neon-soaked aesthetic seeped into his work, but so did the darkness. His visuals became more disturbing, more confrontational, reflecting the psychological chaos of living permanently at the edge. The line between art and self-destruction was disappearing.

When his French filmmaker friends returned to Paris to complete their project, Vex followed - not for a fresh start, but to dive deeper into the void that was consuming him.`,
      atmosphere: "🌃 Fetish Underground"
    },
    {
      title: "PARIS: CINEMA EXTREME & DMT",
      content: `Paris offered a different kind of underground - one rooted in transgression and extreme experience. Working as an editor in the porn industry and hanging with the Cinema Extreme crowd, Vex found himself deep in the city's most provocative creative circles.

This was the era of Gaspar Noé's "Enter the Void" (2009) - Vex was there, part of that scene, working alongside filmmakers like Noé and Marc Caro who pushed cinema into territories that made audiences physically sick. The editing work paid the bills, but it was the artistic collaborations that fed his soul.

DMT became his obsession during these years. The molecule that could transport consciousness to impossible realms - this was the tool he'd been searching for. Late nights in Montmartre editing suites became late nights exploring inner space, the boundaries between reality and hallucination dissolving completely.

The combination of extreme cinema and psychedelic exploration pushed his work into new territories. He began to understand how image, sound, and altered consciousness could work together to create experiences that weren't just art - they were reality-altering technologies.

But the lifestyle was unsustainable. The drugs, the industry's exploitation, the constant push toward more extreme content - even for someone who thrived on the edge, there were limits. The commercial pressures felt increasingly hollow against the backdrop of genuine transcendence.

*"We weren't just making films - we were engineering consciousness itself."*`,
      atmosphere: "🎬 Cinema Extreme"
    },
    {
      title: "LONDON RETURN: ADDICTION & DISILLUSION",
      content: `Back in London, Vex was a mess. The years of excess in Tokyo and Paris had taken their toll - drug addiction, financial chaos, relationships destroyed. He tried to channel his filmmaking skills into documentary work and journalism, but he was barely functional.

The city had changed - gentrification was accelerating, the underground scenes he'd known were being priced out, but Vex was too fucked up to properly engage. His documentary work was sporadic, his writing increasingly erratic. The addiction was winning.

He'd document the changing face of London's creative communities when he could focus long enough: stories of artists forced out of their studios, musicians struggling to find venues, the slow death of authentic culture. But mostly he was just trying to survive.

His work occasionally gained recognition in alternative media circles, but editors were wary. Vex had a reputation - unreliable, difficult, always causing problems. The more he documented the system, the more disillusioned he became, but he was also documenting his own decline.

The financial crash of 2008 crystallized his growing cynicism, but it also coincided with his personal rock bottom. The very institutions he was writing for were part of the problem, but so was he - just another addict making excuses.

*"I was documenting the decline of everything I loved while contributing nothing but chaos to the world."*`,
      atmosphere: "📰 Rock Bottom"
    },
    {
      title: "TIBETAN INTERLUDE: SILENCE & REFLECTION",
      content: `Burned out and spiritually exhausted, Vex made the radical decision to withdraw from the world entirely. A Tibetan Buddhist monastery in the mountains offered what he desperately needed: silence, simplicity, and space for deep reflection.

For several years, he lived according to monastic discipline: early morning meditation, manual labor, study of Buddhist philosophy, and most importantly, complete disconnection from the digital world that had consumed his life.

The silence was initially torturous for someone whose life had been defined by constant stimulation. But gradually, in the space between thoughts, he began to rediscover his authentic creative impulse - not the ego-driven need for recognition, but the pure joy of creation itself.

Buddhist concepts of impermanence, interconnectedness, and the illusory nature of the self began to influence his understanding of art and identity. The "Vex Void" persona he'd been constructing for years started to feel like just another attachment to be released.

But even in the monastery, he couldn't completely escape his nature. Late at night, he'd find himself mentally composing music, visualizing impossible art installations, dreaming of ways to translate the profound peace he'd found into forms that could reach others.`,
      atmosphere: "🧘 Monastic Silence"
    },
    {
      title: "EAST LONDON: THE MINICAB YEARS",
      content: `Returning to London in the early 2010s, Vex found a city transformed yet again. But this time, something new was emerging from the digital underground: cryptocurrency, blockchain technology, and the cypherpunk movement.

In 2012, when most people had never heard of Bitcoin, Vex became a devoted student of Satoshi Nakamoto's revolutionary whitepaper. The pseudonymous creator's vision of decentralized money resonated deeply with someone who'd spent decades in underground scenes that operated outside mainstream systems.

To survive, Vex drove a minicab for eight years. But this wasn't just a job - it became his mobile university and evangelical platform. Night after night, cruising through London's streets, he'd lecture passengers about Bitcoin, blockchain technology, and the coming financial revolution.

*"Mate, you need to understand - this Satoshi guy has cracked it. Decentralized money, no banks, no government control. Get yourself some Bitcoin before it's too late."*

His passengers got an earful: drunk bankers heading home from the City would be subjected to passionate explanations of cryptographic proof-of-work. Late-night party-goers found themselves receiving impromptu seminars on monetary sovereignty. Even the skeptical ones couldn't help but be impressed by his deep technical knowledge and genuine conviction.

The minicab became his meditation space, his thinking chamber, his connection to the pulse of the city. Eight years of conversations, observations, and continuous learning while East London's tech scene buzzed with excitement about decentralized systems and the possibility of creating economic structures outside traditional banking.

He dove deep into the technical aspects during downtime: cryptography, consensus mechanisms, smart contracts. But more than the technology, it was the philosophy that captivated him - the idea that code could be law, that mathematics could guarantee freedom, that artists could interact directly with their audience without intermediaries.

*"Satoshi showed us that anonymous creators could change the world. The ghost writer had found his medium - and his mobile classroom."*`,
      atmosphere: "🚗 The Minicab Professor"
    },
    {
      title: "REBIRTH: V3XV0ID EMERGES",
      content: `After 30 years of searching, struggling, and synthesizing influences from across the globe, Vex Void was finally ready to emerge as the artist he'd always aspired to be: V3XV0ID.

Drawing from three decades of experience - the discipline of Ninja Tune, the raw energy of Birmingham's streets, the technical precision of Tokyo's clubs, the narrative sophistication of Parisian cinema, the spiritual depth discovered in Tibetan silence, and the revolutionary potential of cryptocurrency - V3XV0ID represents the synthesis of everything Vex had learned.

The debut album "v3x v0id 01" channels all these influences into a cohesive artistic statement: ninja jazz rhythms built on blockchain principles, street art aesthetics rendered in digital media, spiritual depth expressed through technological innovation.

The $V3X token represents more than just a cryptocurrency - it's a new model for artist-fan relationships, a way to build authentic community around shared values rather than corporate manipulation.

Selling digital art and code direct from the cypherverse, V3XV0ID embodies the cypherpunk dream: creative autonomy, technological sovereignty, and direct peer-to-peer connection.

*"This isn't just music or art - it's a complete reimagining of how creative culture can exist in the digital age."*

The ghost writer has finally found his voice. The journey from displaced Asian kid to blockchain artist is complete. V3XV0ID is born.`,
      atmosphere: "🚀 Digital Renaissance"
    }
  ];

  const nextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold lo-fi-text mb-4">
            V3XV0ID LORE
          </h1>
          <div className="text-cyan-400 lo-fi-text mb-2">
            THE AUTHENTIC STORY
          </div>
          <div className="text-white/50 text-sm">
            {chapters[currentChapter].atmosphere}
          </div>
        </div>

        {/* Chapter Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 flex-wrap">
            {chapters.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentChapter(index)}
                className={`w-3 h-3 border transition-colors ${
                  index === currentChapter
                    ? 'bg-cyan-400 border-cyan-400'
                    : 'bg-transparent border-white/30 hover:border-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Chapter Content */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold lo-fi-text mb-6 text-cyan-400">
            {chapters[currentChapter].title}
          </h2>
          
          <div className="text-white/90 leading-relaxed whitespace-pre-line text-sm md:text-base lo-fi-text">
            {chapters[currentChapter].content}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={prevChapter}
            disabled={currentChapter === 0}
            className={`px-6 py-3 lo-fi-text transition-colors ${
              currentChapter === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            ← PREVIOUS
          </button>

          <div className="text-center">
            <div className="text-white/70 text-sm lo-fi-text">
              Chapter {currentChapter + 1} of {chapters.length}
            </div>
          </div>

          <button
            onClick={nextChapter}
            disabled={currentChapter === chapters.length - 1}
            className={`px-6 py-3 lo-fi-text transition-colors ${
              currentChapter === chapters.length - 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
            }`}
          >
            NEXT →
          </button>
        </div>

        {/* Key Influences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/30 border border-cyan-500/20 p-4">
            <h3 className="text-cyan-400 font-bold lo-fi-text mb-2">🥷 NINJA TUNE ERA</h3>
            <div className="text-white/70 text-xs lo-fi-text">
              Intelligent electronics, sampling mastery, underground philosophy
            </div>
          </div>
          
          <div className="bg-black/30 border border-green-500/20 p-4">
            <h3 className="text-green-400 font-bold lo-fi-text mb-2">🎨 STREET CULTURE</h3>
            <div className="text-white/70 text-xs lo-fi-text">
              Birmingham graffiti, skateboarding, drum & bass
            </div>
          </div>
          
          <div className="bg-black/30 border border-red-500/20 p-4">
            <h3 className="text-red-400 font-bold lo-fi-text mb-2">🌃 TOKYO PRECISION</h3>
            <div className="text-white/70 text-xs lo-fi-text">
              Club visuals, technical mastery, cyberpunk aesthetic
            </div>
          </div>

          <div className="bg-black/30 border border-yellow-500/20 p-4">
            <h3 className="text-yellow-400 font-bold lo-fi-text mb-2">₿ CYPHERPUNK</h3>
            <div className="text-white/70 text-xs lo-fi-text">
              Blockchain, decentralization, crypto culture
            </div>
          </div>
        </div>

        {/* The V3XV0ID Sound */}
        <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold lo-fi-text mb-4 text-cyan-400">🎧 THE V3XV0ID SYNTHESIS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="text-cyan-400 font-bold mb-3">MUSICAL DNA</h4>
              <ul className="text-white/70 space-y-1 lo-fi-text">
                <li>• <strong>Ninja Tune:</strong> Amon Tobin, DJ Krush, DJ Shadow, Coldcut, DJ Food</li>
                <li>• <strong>Mo Wax/Trip-Hop:</strong> James Lavelle, UNKLE, later Gorillaz</li>
                <li>• <strong>Early Jungle:</strong> Shy FX, Dillinger, raw breakbeat pioneers</li>
                <li>• <strong>Metalheadz Era:</strong> Goldie, LTJ Bukem, Photek, sophisticated D&B</li>
                <li>• <strong>Electronic Pioneers:</strong> Aphex Twin, Squarepusher, Autechre</li>
                <li>• <strong>Cypherpunk Influence:</strong> Satoshi Nakamoto (philosophy), Bitcoin ethos</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-cyan-400 font-bold mb-3">VISUAL INFLUENCES</h4>
              <ul className="text-white/70 space-y-1 lo-fi-text">
                <li>• <strong>Street Art:</strong> Banksy, INSA, Shepard Fairey</li>
                <li>• <strong>90s Pioneers:</strong> Goldie (visual art), Futura 2000</li>
                <li>• <strong>3D Artists:</strong> Joost Korngold, early CGI pioneers</li>
                <li>• <strong>Photography:</strong> Nan Goldin, Larry Clark</li>
                <li>• <strong>Film:</strong> Wong Kar-wai, Gaspar Noé</li>
                <li>• <strong>Digital Art:</strong> Early net.art collectives</li>
              </ul>
            </div>

            <div>
              <h4 className="text-cyan-400 font-bold mb-3">CULTURAL SYNTHESIS</h4>
              <ul className="text-white/70 space-y-1 lo-fi-text">
                <li>• Eastern philosophy meets Western rebellion</li>
                <li>• Analog warmth in digital spaces</li>
                <li>• Street culture elevated to high art</li>
                <li>• Buddhist minimalism with maximalist production</li>
                <li>• Cypherpunk ideology as artistic practice</li>
                <li>• Blockchain as creative medium</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Era */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold lo-fi-text mb-4 text-cyan-400">🚀 THE V3XV0ID ERA</h3>
          <div className="text-white/90 lo-fi-text text-sm leading-relaxed">
            <p className="mb-4">
              <strong>Album:</strong> "v3x v0id 01" - The debut synthesis of 30 years of creative evolution
            </p>
            <p className="mb-4">
              <strong>Token:</strong> $V3X - Revolutionary artist-fan relationship model
            </p>
            <p className="mb-4">
              <strong>Platform:</strong> Direct from the cypherverse - no intermediaries, no corporate control
            </p>
            <p>
              <strong>Mission:</strong> Proving that authentic art and decentralized technology can create new forms of creative community
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="mb-4">
            <a
              href="/studio"
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 lo-fi-text transition-colors mr-4"
            >
              ENTER THE STUDIO
            </a>
            <a
              href="/token"
              className="inline-block bg-white/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-3 lo-fi-text transition-colors"
            >
              GET $V3X TOKEN
            </a>
          </div>
          <div className="text-white/50 text-xs lo-fi-text">
            "Fame without face. Sound without source. Art without arrest."
          </div>
        </div>
      </div>
    </div>
  );
} 