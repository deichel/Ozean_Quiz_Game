'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.  
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

//This function returns a descriptive sentence about your data.  Before a user starts a quiz, they can ask about a specific data element,
//like "Ohio."  The skill will speak the sentence from this function, pulling the data values from the appropriate record in your data.
function getSpeechDescription(item)
{
    var sentence = item.Lebewesen + " gehört zur Klasse der " + item.DieKlasse + " und hat als Lebensraum " + item.DerLebensraum + ". " + item.Info + " Was noch?";
    return sentence;
}

//We have provided two ways to create your quiz questions.  The default way is to phrase all of your questions like: "What is X of Y?"
//If this approach doesn't work for your data, take a look at the commented code in this function.  You can write a different question
//structure for each property of your data.
function getQuestion(counter, property, item)
{
    return "Hier ist deine " + counter + "te Frage.  Was ist " + formatCasing(property) + " von "  + item.Lebewesen + "?";

    /*
    switch(property)
    {
        case "City":
            return "Here is your " + counter + "th question.  In what city do the " + item.League + "'s "  + item.Mascot + " play?";
        break;
        case "Sport":
            return "Here is your " + counter + "th question.  What sport do the " + item.City + " " + item.Mascot + " play?";
        break;
        case "HeadCoach":
            return "Here is your " + counter + "th question.  Who is the head coach of the " + item.City + " " + item.Mascot + "?";
        break;
        default:
            return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of the "  + item.Mascot + "?";
        break;
    }
    */
}

//This is the function that returns an answer to your user during the quiz.  Much like the "getQuestion" function above, you can use a
//switch() statement to create different responses for each property in your data.  For example, when this quiz has an answer that includes
//a state abbreviation, we add some SSML to make sure that Alexa spells that abbreviation out (instead of trying to pronounce it.)
function getAnswer(property, item)
{
        return formatCasing(property) + " von " + item.Lebewesen + " ist " + item[property] + ". " + item.Info + " ";
    
}

//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["jawohl", "japp", "manometer", "Bazinga", "Bingo", "na sieh mal einer an", "Bravo", "okey dokey", "prima", "schau an", 
"Hip hip hooray", "stimmt", "Oje.  War nur ein scherz.  Hurray", "super", "supi", "tada", "wow", "voila", "Woo hoo", "Yay", "türlich"];

//This is a list of negative speechcons that this skill will use when a user gets an incorrect answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsWrong = ["Argh", "Aw man", "ach du grüne neune", "ach du liebe zeit", "achje", "als ob", "argh", "au weia", "autsch", "buhu", "bzz",
"Mamma mia", "Oh boy", "da lachen ja die hühner", "huch", "Ouch", "ich glaub ich bin im kino", "ich glaub mein schwein pfeift", "ich glaub mich knutscht ein elch", "ich glaub mich laust der affe", "ich glaub mich tritt ein pferd", "ist nicht dein ernst", "kein kommentar", "mist", "nanu?", "nix da", "och", "oh mann", "oh nein", "oh oh", "oink", "oje", "schade", "seufz", "verdammt", "verflixt", "von wegen", "was zur hölle"];

//This is the welcome message for when a user starts the skill without a specific intent.
var WELCOME_MESSAGE = "Hallo und Willkommen beim Quiz zum Wissenschaftsjahr Meere und Ozeane! Meere und Ozeane sind Klimamaschine, Nahrungsquelle, Wirtschaftsraum und Heimat vieler Planzen und Tiere. Noch immer gibt es in ihrem geheimnisvollen Blau viel zu entdecken. Im Wissenschaftsjahr 2016-17 wird die große Artenvielfalt in den Lebensräumen der Meere und Ozeane beleuchtet. Dieses Quiz zeigt nur eine kleine Auswahl der Biodiversität. Du kannst mich nach Lebewesen der Meere und Ozeane fragen, oder einen Quiz starten. Was möchtest du tun?";  

//This is the message a user will hear when they start a quiz.
var START_QUIZ_MESSAGE = "OK. Ich werde dir 10 Fragen über die Lebewesen der Meere und Ozeane fragen.";

//This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
var EXIT_SKILL_MESSAGE = "Vielen Dank fürs mitspielen! Bis zum nächsten mal!";

//This is the message a user will hear after they ask (and hear) about a specific data element.
var REPROMPT_SPEECH = "Was noch?";

//This is the message a user will hear when they ask Alexa for help in your skill.
var HELP_MESSAGE = "Ich weiß eine Menge über die Lebewesen der Meere und Ozeane. Frag mich nach einem. Wir können auch ein Quiz starten. Was möchtest du tun?";


//This is the response a user will receive when they ask about something we weren't expecting.  For example, say "pizza" to your
//skill when it starts.  This is the response you will receive.
function getBadAnswer(item) { return "Tut mir Leid. " + item + ", davon hab ich keine Ahnung. " + HELP_MESSAGE; }

//This is the message a user will receive after each question of a quiz.  It reminds them of their current score.
function getCurrentScore(score, counter) { return "Deine Punktzahl ist " + score + " von " + counter + ", "; }

//This is the message a user will receive after they complete a quiz.  It tells them their final score.
function getFinalScore(score, counter) { return "Deine Punktzahl ist " + score + " von " + counter + ", "; }

//These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
//This only happens outside of a quiz.

//If you don't want to use cards in your skill, set the USE_CARDS_FLAG to false.  If you set it to true, you will need an image for each
//item in your data.
var USE_CARDS_FLAG = true;

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) { return item.Lebewesen;}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
//function getSmallImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/720x400/" + item.Abbreviation + "._TTH_.png"; }

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
//function getLargeImage(item) { return "https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/state_flag/1200x800/" + item.Abbreviation + "._TTH_.png"; }

//=========================================================================================================================================
//TODO: Replace this data with your own.
//=========================================================================================================================================
var data = [
    {Lebewesen: "Raue Pilzkoralle", Info: "Raue Pilzkorallen sind nicht festgewachsen, sie krabbeln über den Boden mit bis zu 6cm pro Stunde. Anders als andere Korallen wird die Raue Pilzkoralle von nur einem Polypen gebildet. Mit ihrer besonders großen Mundöffnung kann die Raue Pilzkoralle auch große Beuten wie Quallen fressen.", DieKlasse: "Blumentiere", DerLebensraum: "Tropische Korallenriffe"},
    {Lebewesen: "Pracht Fahnenbarsch", Info: "Ein großes Vorkommen von Fahnenbarschen in Korallenriffen ist ein Zeichen für die Gesundheit des Riffs. Sie leben dort in Harems. Geschlechtsreife Tiere sind zuerst weiblich und wandeln sich später zu männchen um. Durch soziale unterdrückung hindern die dominierenden Männchen die Weibchen ihres Harems daran, sich in Männchen umzuwandeln.", DieKlasse: "Fische", DerLebensraum: "Tropische Korallenriffe"},
    {Lebewesen: "Echte Karettschildkröte", Info: "die Echte Karettschildkröte lebt hauptsächlich in Korallenriffen und ernährt sich dort von Schwämmen und den Polypen der Korallen. Ihr Panzer ist besonders wertvoll, was diese Art lange Zeit zur Beute von Jägern gemacht und ihren Bestand stark dezimiert hat. Heute ist die Echte Karettschildkröte vom Aussterben bedroht und steht daher unter Artenschutz.", DieKlasse: "Reptilien", DerLebensraum: "Tropische Korallenriffe"},
    {Lebewesen: "Weißaugenmuräne", Info: "Die Weißaugenmuräne kommt im tropischen Indopazifik vor. Sie bewohnt vor allem flache Lagunen, küstennahe Riffe sowie Tang und Seegrasfelder. Sie wird bis zu 65 cm lang und lebt paarweise oder in kleinen Gruppen zusammen. Ihre Nahrung besteht vor allem aus Krustentieren, kleinen Fischen und Kraken.", DieKlasse: "Fische", DerLebensraum: "Tropische Korallenriffe"},
    {Lebewesen: "Riesentang", Info: "Mit bis zu 45 m Länge ist der Riesentang die größte aller festsitzenden Algen im Meer. Der Riesentang ist an der Pazifikküste Nord und Südamerikas weit verbreitet und besitzt eine große wirtschaftliche Bedeutung für die Gewinnung von Alginaten und als Nahrungsmittel in der Aquakultur von Meeresschnecken.", DieKlasse: "Braunalgen", DerLebensraum: "Kelpwälder"},
    {Lebewesen: "Kelpfisch", Info: "Der Kelpfisch lebt in den wellenexponierten und der Strömung ausgesetzten Bereichen in den Tangwäldern vor den Küsten Australiens und Neuseelands und im Ostpazifik. Man erkennt ihn an seinem gescheckten, braun-weißem Muster, so ist er in den Algen bestens getarnt. Er ernährt sich vor allem von wirbellosen Tieren und kleinen Fischen.", DieKlasse: "Fische", DerLebensraum: "Kelpwälder"},
    {Lebewesen: "Südliche Napf Schnecke", Info: "Die bis zu 4 cm große Südliche Napfschnecke lebt in Südpatagonien fast ausschlieslich auf dem Riesentang. Ihre Schale ist dünn und zerbrechlich. Ihre Farbe variiert von grünlich oliv bis leicht bräunlich, die Innenseite ist silbern irisierend.", DieKlasse: "Schnecken", DerLebensraum: "Kelpwälder"},
    {Lebewesen: "Grüner Seeigel", Info: "Seeigel zeichnen sich durch ihr hohles Kalkskelett und ihre Stacheln aus. Der grüne Seeigel kommt sowohl im Südadlantik als auch im Südpazifik sehr häufig in Wassertiefen bis 20 m vor. Er ist grünlich gefärbt und ernährt sich hauptsächlich von Algen und kleinen Schnecken, Muscheln und Würmern.", DieKlasse: "Stachelhäuter", DerLebensraum: "Kelpwälder"},
    {Lebewesen: "Prächtiger Salzkäfer", Info: "Die Salzwiesen der Nordseeküste weisen eine außerordentlich hohe Biodiversität auf, und beheimaten um die 300 Wirbellosenarten. Der Prächtige Salzkäfer ist eine von ihnen. Seine Beine sind kräftig bedornt, um beim Graben zu helfen. Durch eine stark eingeschnürte Taille zwischen Brust und Hinterleib ist der Käfer sehr beweglich, was das Wenden in seinen Erdröhren erleichtert.", DieKlasse: "Insekten", DerLebensraum: "Salzwiesen"},
    {Lebewesen: "Halligflieder", Info: "Der Halligflieder hat zwar die gleiche bläulich lila Färbung wie der gewöhnliche Flieder, wird allerdings nur 15 bis 30 cm hoch. Er hat möglichkeiten entwickelt, das über die Wurzeln aufgenommene Salzwasser auszuscheiden. Über spezielle Drüsen transportiert er es nach draußen.", DieKlasse: "Nelkenartige", DerLebensraum: "Salzwiesen"},
    {Lebewesen: "Rotschenkel", Info: "Salzwiesen sind wichtige Lebensräume für Rotschenkel. Dort finden sie nicht nur ideale Brutbedingungen, sondern auch Insekten, Schnecken, Würmer und Krebse. Pro Minute kann ein Rotschenkel bis zu 50 Krebse jagen. Wegen seines markanten Gesangs wird der Rotschenkel auf Plattdeutsch auch Tüter genannt.", DieKlasse: "Vögel", DerLebensraum: "Salzwiesen"},
    {Lebewesen: "Strand Grasnelke", Info: "Die rosa Blütenköpfe der Strand Grasnelken sehen zwar zart aus, trotzen jedoch auch starkem Wind. Sie kommt nicht nur an ihren natürlichen, salzhaltigen Standorten an Küsten vor, sondern auch auf schwermetallhaltigen Böden und wächst oft auch auf den versalzenen Mittelstreifen entlang der Autobahnen.", DieKlasse: "Nelkenartige", DerLebensraum: "Salzwiesen"},
    {Lebewesen: "Fleischschwamm", Info: "Der Fleischschwamm ist skelettlos und besteht aus mehreren glatten, aber weichen Knollen, die sich zu einer Kruste mit bis zu 30 cm Durchmesser ausbilden. Fleischschwämme sind nicht immer rosa, auch wenn dies zu ihrem Namen am besten passt. Sie können auch blau, violett oder rot sein.", DieKlasse: "Manteltiere", DerLebensraum: "Mittelmeer"},
    {Lebewesen: "Leoparden-schnecke", Info: "Die Leopardenschnecke, mitunter auch als Kuhschnecke bezeichnet, wird bis zu 10 cm groß und hat als Grundfärbung ein milchiges Weiß, das von tiefbraunen Leopardenflecken unterbrochen wird. Sowohl die Anzahl der Flecken als auch deren Größe und Farbintensität ist variabel. Man findet Leopardenschnecken meist auf Schwämmen am Meeresgrund, die ihnen auch als Nahrung dienen.", DieKlasse: "Schnecken", DerLebensraum: "Mittelmeer"},
    {Lebewesen: "Schriftbarsch", Info: "Der schriftbarsch wird etwa 30 cm groß und ist nach der feinen Musterung seines Kopfes benannt, die an arabische Schriftzeichen erinnert. Er lebt meist alleine und lauert in Felsspalten auf seine Beute. Bevorzugt ernährt er sich von Garnelen, Krabben, Würmern, Tintenfischen oder auch kleinen Fischen.", DieKlasse: "Fische", DerLebensraum: "Mittelmeer"},
    {Lebewesen: "See Erdbeere", Info: "See Erdbeeren sind kleine orange-weiße, filtrierende Kolonien mit einem Durchmesser von bis zu 5 cm. Sie leben überwiegend auf Felsen im Wassertiefen von 5 bis 20 cm. Eine Kolonie setzt sich aus vielen kleinen Einzeltieren zusammen, die gemeinsame Ausstromöffnungen bilden.", DieKlasse: "Blumentiere", DerLebensraum: "Mittelmeer"},
    {Lebewesen: "Tüpfelgrünschenkel", Info: "Zum Brüten bevorzugt der Tüpfelgrünschenkel feuchte Küstenwiesen, zur Nahrungssuche begibt er sich ins Watt. Er gehört zu den wenigen Wattvögeln, die ein richtiges Nest bauen. Er ist im asiatischen Raum zuhause, wobei der Bestand immer weiter abnimmt. Schätzungen zufolge gibt es weltweit nur noch 500 bis 1000 Exemplare.", DieKlasse: "Vögel", DerLebensraum: "Wattenmeere"},
    {Lebewesen: "Seehund", Info: "Seehunde sind die wohl bekanntesten Meeressäuger, die vor der Nordseeküste leben. Sie können ein Gewicht von bis zu 120 kg erreichen. Durch menschliche Störungen, Wettereinflüsse oder sehr selten durch den Tod der Mutter kommt es vor, dass junge Seehunde alleine zurückbleiben. Dem lauten klagen, mit dem diese verwaisten Jungtiere nach ihrer Mutter rufen, verdanken sie ihren Namen, Heuler.", DieKlasse: "Säugetiere", DerLebensraum: "Wattenmeere"},
    {Lebewesen: "Wattwurm", Info: "Der Wattwurm oder Pierwurm ist eines der bekanntesten Tiere des Watts, was insbesondere an seinen charakteristischen, aus Sandschnüren bestehenden Kothaufen im Watt liegt. Der rotbraune bis schwärzliche Wurm wird bis zu 40 cm lang und ist im Vorderbereich etwa fingerdick. Seine Kiemen sind deutlich sichtbar.", DieKlasse: "Würmer", DerLebensraum: "Wattenmeere"},
    {Lebewesen: "Aalmutter", Info: "Die Aalmutter wird etwa 40 cm lang, ihre dunklen Schuppen sind mit dickem Schleim bedeckt. Die Aalmutter legt keine Eier, sondern beim Weibchen entwickeln sich nach innerer Befruchtung aus 30-400 Eiern innerhalb von 120 Tagen etwa 5 cm lange Jungfische.", DieKlasse: "Fische", DerLebensraum: "Wattenmeere"},
    {Lebewesen: "Walross", Info: "Berühmt für seine langen Stoßzähne, kann das Walross in vielerlei Hinsicht beeindrucken, ein ausgewachsenes Walross Männchen wiegt bis zu 1,5 t. Bewegt sich an Land mit bis zu 35 km/h und kann im Wasser bis zu 30 Minuten ohne Unterbrechung in Wassertiefen bis zu 70 m tauchen.", DieKlasse: "Säugetiere", DerLebensraum: "Polarmeere"},
    {Lebewesen: "Zügelpinguin", Info: "Ein dichtes Federkleid und eine dicke Speckschicht rüsten den Zügelpinguin für die Lebensbedingungen in der Antarktis. Besonders während der Brutzeit findet man ihn dort in großen Kolonien. Um miteinander zu kommunizieren, winken die Pinguine mit den Flügeln, nicken oder schütteln den Kopf, verbeugen oder putzen sich.", DieKlasse: "Vögel", DerLebensraum: "Polarmeere"},
    {Lebewesen: "Polardorsch", Info: "Der Polardorsch ist in den eiskalten Gewässern rund um den Nordpol zuhause. Dort ernährt er sich von Plankton, ist aber auch selbst eine beliebte Beute von Vögeln, Meeressäugern und anderen Fischen.", DieKlasse: "Fische", DerLebensraum: "Polarmeere"},
    {Lebewesen: "See Elefant", Info: "Benannt sind die See Elefanten nach der rüsselartig vergrößerten Nase der erwachsenen Männchen. Die Männchen werden bis zu 6 m lang und bis zu 3,5 t schwer und erreichen so fast die doppelte Länge der Weibchen. Damit sind sie die größte Robbenart der Welt. in der paarungszeit leben die Tiere in Kolonien zusammen, auf einen einzelnen Bullen kommen babei ca. 30 Kühe.", DieKlasse: "Säugetiere", DerLebensraum: "Polarmeere"},
    {Lebewesen: "Rote Mangrove", Info: "Dei Rote Mangrove ist äußerst rubust gegen Salzwasser und kann sich an unterschiedlichste Umweltbedingungen anpassen. Optisch fallen Rhizophora-Arten vor allem durch ihre besonders großen, bogenförmigen Stelzwurzeln auf, die den Baum im Schlamm fester verankern und über ihre Oberfläche atmen, da der schlammige Boden sehr arm an Sauerstoff ist.", DieKlasse: "Rhizophoragewächse", DerLebensraum: "Mangrovenwälder"},
    {Lebewesen: "Knallkrebs", Info: "Ihren Namen verdanken Knallkrebse, auch Pistolenkrebse genannt, einem beeindruckenden Gräusch, das sie erzeugen können, mit ihrer Knallschere stoßen sie einen Wasserstrahl aus, der eine dampfgefüllte Blase bildet. Wemm diese implodiert, erzeugt sie neben einem lauten Knall auch einen Lichtblitz und örtliche Temperaturen von mehr als 4700°C.", DieKlasse: "Höhere Krebse", DerLebensraum: "Mangrovenwälder"},
    {Lebewesen: "Schlammspringer", Info: "Der Schlammspringer ist ein ganz besonderer Fisch, er lebt nicht nur im Wasser, sondern kricht mit seinen kräftigen Flossen auch durch schlamm und klettert sogar auf Bäume. Wenn er an Land ist, verschließt er seine Kiemen und verhindert das Austrocknen seiner Augen durch in Hauttaschen gespeichertes Wasser.", DieKlasse: "Fische", DerLebensraum: "Mangrovenwälder"},
    {Lebewesen: "Mangrovengrille", Info: "Die Mangrovengrille hat sich auf erstaunliche Weise an ihre Umwelt und die Tide angepasst, sie verharrt mit Beginn der flut still im Astwerk der Mangrovenbäume und sucht bei Ebbe Nahrung auf den freifallenden Flächen der Schlickwatten.", DieKlasse: "Insekten", DerLebensraum: "Mangrovenwälder"},
    {Lebewesen: "Weissbauchtölpel", Info: "Der Weißbauchtölpel ist ein wendiger Flieger, der auf dem offenen Ozean im Steilflug auf seine Beute hinabstößt. So geschickt er fliegt, so schwerfällig ist seine fortbewegung an Land. Er sit weit verbreitet und kommt vor allem im Atlantik, Pazifik und im Indischen Ozean vor.", DieKlasse: "Vögel", DerLebensraum: "Hochsee"},
    {Lebewesen: "Mondfisch", Info: "Der Mondfisch gilt als der schwerste Knochenfisch der Welt. Er kann eine Länge von 3 m und ein Gewicht von 2t erreichen. Mondfische halten sich oft in der Nähe der Oberfläche auf, entweder senkrecht schwimmend oder in Seitenlage an der Wasseroberfläche treibend und sich sonnend. Das Mondfischweibchen kann pro Laichvorgang bis zu 300 Millionen Eier legen, die höchste Zahl aller Fischarten.", DieKlasse: "Fische", DerLebensraum: "Hochsee"},
    {Lebewesen: "Spiegeleiqualle", Info: "Mit ihrem weißlichem Schirm und dem gelben Dotter in der Mitte macht die Spiegeleiqualle ihrem Namen alle Ehre. Sie hat acht zentrale und viele kleine Arme, zwischen denen zahlreiche Fische Zuflucht finden. Zur Fortpflanzung entlässt die weibliche Qualle kurz vor ihrem Tod Larven, aus denen sich am Meeresboden zunächst festsizende Polypen und schlislich neue, freischwimmende Quallen bilden.", DieKlasse: "Schirmquallen", DerLebensraum: "Hochsee"},
    {Lebewesen: "Buckelwal", Info: "Das vorkommen der Buckelwale erstreckt sich über sämtliche Ozeane. Ihr Name bezieht sich auf den Buckel, den sie beim Abtauchen bilden. Buckelwale zeichnen sich besonders durch ihre flügelartigen Brustflossen, ihre idividuell gefurchten und gefärbten Schwanzflossen und ihren Gesang aus. Sie werden bis zu 19m lang und stehen weltweit unter Schutz.", DieKlasse: "Säugetiere", DerLebensraum: "Hochsee"}
            ];

//=========================================================================================================================================
//Editing anything below this line might break your skill.  
//=========================================================================================================================================

var counter = 0;

var states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

var startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.emit(":ask", WELCOME_MESSAGE, HELP_MESSAGE);
    },
    "AnswerIntent": function() {
        var item = getItem(this.event.request.intent.slots);

        if (item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
            if (USE_CARDS_FLAG)
            {
                //var imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};
                this.emit(":askWithCard", getSpeechDescription(item), REPROMPT_SPEECH, getCardTitle(item), getTextDescription(item));
            }
            else
            {
                this.emit(":ask", getSpeechDescription(item), REPROMPT_SPEECH);
            }
        }
        else
        {
            this.emit(":ask", getBadAnswer(item), getBadAnswer(item));
            
        }
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


var quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        var random = getRandom(0, data.length-1);
        var item = data[random];

        var propertyArray = Object.getOwnPropertyNames(item);
        var property = propertyArray[getRandom(2, propertyArray.length-1)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        var question = getQuestion(this.attributes["counter"], property, item);
        var speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        var response = "";
        var item = this.attributes["quizitem"];
        var property = this.attributes["quizproperty"]

        var correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.emit(":tell", response + " " + EXIT_SKILL_MESSAGE);
        }
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.CancelIntent": function() {
        this.emit(":tell", EXIT_SKILL_MESSAGE);
    },
    "AMAZON.HelpIntent": function() {
        this.emit(":ask", HELP_MESSAGE, HELP_MESSAGE);
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (var slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    var propertyArray = Object.getOwnPropertyNames(data[0]);
    var value;
    
    for (var slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (var property in propertyArray)
            {
                var item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    var speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";    
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    var text = "";
    
    for (var key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
