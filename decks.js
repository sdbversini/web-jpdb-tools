function listUserDecks(apiKey) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: '{"fields":["id","name","vocabulary_count"]}'
  };

  return fetch('https://jpdb.io/api/v1/list-user-decks', options)
    .then(response => response.json())
    .then(response => {
      return response.decks;
    })
    .catch(err => console.error(err));
}

function listSpecialDecks(apiKey) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: '{"fields":["id","name","vocabulary_count"]}'
  };

  return fetch('https://jpdb.io/api/v1/list-special-decks', options)
    .then(response => response.json())
    .then(response => {
      return response.decks;
    })
    .catch(err => console.error(err));
}

function listVocabulary(apiKey, deckId) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: '{"id":' + deckId + ',"fetch_occurences":true}'
  };

  return fetch('https://jpdb.io/api/v1/deck/list-vocabulary', options)
    .then(response => response.json())
    .then(response => { return response; })
    .catch(err => console.error(err));
}

function deleteDecks(apiKey, deckId) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: '{"id":' + deckId + '}'
  };

  return fetch('https://jpdb.io/api/v1/deck/delete', options)
    .then(response => response.json())
    .then(response => { return response; })
    .catch(err => console.error(err));

}

function deckInfo(selected, decks) {
  return decks.filter(deck => selected.includes(deck[0]));
}

const { createApp, ref, computed } = Vue;
const app = createApp({
  data() {
    return {
      message: "hi",
      apiKey: "",
      deckImportName: "new deck name",
      apiKeyOkay: false,
      decks: [],
      userDecks: [],
      selected: 0,
      selectedToDelete: [],
    }
  },
  methods: {
    verifyApiKey() {
      this.decks = [];
      this.userDecks = [];
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.apiKey,
        },
        body: 'false',
      };

      fetch('https://jpdb.io/api/v1/ping', options)
        // .then(response => response.json())
        .then(response => {
          if (response.ok) {
            this.apiKeyOkay = true;
            listUserDecks(this.apiKey).then(decks => {
              this.decks = decks;
              this.userDecks = decks;
            }).then(() => {
              listSpecialDecks(this.apiKey).then(decks => {
                this.decks = this.decks.concat(decks);
              });
            });
          }
        })
        .catch(err => console.error(err));
    },
    exportDeck() {
      listVocabulary(this.apiKey, this.selected).then(
        vocabulary => {
          let a = [];
          vocabulary.vocabulary.forEach((vocab, i) => {
            let item = vocab.concat(vocabulary.occurences[i]);
            a.push(item);
          });
          // console.log(a);
          console.log(a);
          csv = a.map(row => row.join(',')).join('\n');
          console.log(csv);
          return a;
        }

      );
    },
    massDeleteDecks() {
      let selected = deckInfo(this.selectedToDelete, this.userDecks);
      let str = "";
      selected.forEach(e => str = str.concat("\n -", e[1]));
      let confirmed = confirm("The following decks will be deleted: " + str + "\n Are you sure you want to delete them all? All active cards not in an deck will be temporarily disabled until you add a deck with that word in it again, delete operation is definitive.");
      if (confirmed) {
        this.selectedToDelete.forEach(e => {
          //TODO some form of rate limiting?
          deleteDecks(this.apiKey, e);
        });

        this.verifyApiKey();
      }
    }

  },
  watch: {
    apiKey(newApiKey) {
      localStorage.apiKey = newApiKey;
    },
  },
  mounted() {
    if (localStorage.apiKey) {
      this.apiKey = localStorage.apiKey;
    }
  }
});
app.mount("#app");
