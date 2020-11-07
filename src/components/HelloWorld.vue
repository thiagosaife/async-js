<template>
  <b-container fluid>
    <b-row>
      <b-col
        v-for="(fn, idx) in functionsList"
        :key="idx"
        cols="4">
        <b-button class="mx-1"
          @click="fn.fn(idx)">
          {{ fn.label }}
        </b-button>
        <b-button
          @click="clearList(idx)"
          variant="outline-danger">
          <b-icon
            icon="exclamation-circle-fill"
            variant="danger" />
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-3" cols="12">
        <b-card-group deck>
          <b-card
            v-for="(card, idx) in cardsList"
            :key="idx"
            :bg-variant="card.bgVariant"
            text-variant="white"
            :header="card.header"
            class="text-center">
            <b-card-text>
              {{ `${card.seconds}.${fixedDecimals(card.miliseconds)} s` }}
            </b-card-text>
            <b-card-text>
              {{ card.loading ? card.cardText : card.items.length
                ? 'All done!' : 'Clique para começar' }}
            </b-card-text>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="my-1" cols="12">
        <b-card-group deck>
          <b-card
            v-for="(card, idx) in cardsList"
            :key="idx"
            :bg-variant="card.bgVariant"
            text-variant="white"
            class="text-center">
            <div>
              <b-spinner
                v-if="card.loading"
                class="my-3"
                label="Spinning" />
            </div>
            <b-table
              v-if="card.items.length"
              striped
              hover
              :items="card.items" />
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { getAllCards } from '@/services/apiCall';

const async = 'Async/Await';
const callBack = 'Callback';
const promise = 'Promise';

export default {
  name: 'HelloWorld',
  created() {
    this.functionsList.push(
      { fn: (idx) => this.asyncContructionApi(idx), label: async },
      { fn: (idx) => this.callBackContructionApi(idx, this.getResults), label: callBack },
      { fn: (idx) => this.promiseContructionApi(idx), label: promise },
    );
  },
  data() {
    return {
      cardsList: [
        {
          bgVariant: 'info',
          cardText: `Carregando informações com ${async}`,
          header: async,
          items: [],
          loading: false,
          miliseconds: 0,
          seconds: 0,
        },
        {
          bgVariant: 'warning',
          cardText: `Carregando informações ${callBack}`,
          header: callBack,
          items: [],
          loading: false,
          miliseconds: 0,
          seconds: 0,
        },
        {
          bgVariant: 'danger',
          cardText: `Carregando informações ${promise}`,
          header: promise,
          items: [],
          loading: false,
          miliseconds: 0,
          seconds: 0,
        },
      ],
      functionsList: [],
    };
  },
  methods: {
    reduceArrayKeys(originalArray, keysToKeep) {
      return originalArray.map((item) => keysToKeep
        .reduce((acc, key) => {
          acc[key] = item[key];
          return acc;
        }, {}));
    },
    fixedDecimals(num) {
      return `${num}`.substring(0, 2);
    },
    clearList(idx) {
      if (!this.cardsList[idx].items.length) return;
      this.cardsList[idx].items = [];
      this.cardsList[idx].seconds = 0;
      this.cardsList[idx].miliseconds = 0;
    },
    async asyncContructionApi(idx) {
      this.cardsList[idx].loading = true;
      const secInterval = setInterval(() => {
        this.cardsList[idx].seconds += 1;
      }, 1000);
      const miliInterval = setInterval(() => {
        this.cardsList[idx].miliseconds += 1;
      }, 1);
      try {
        const allCards = await getAllCards();
        this.cardsList[idx].loading = false;
        const keysToKeep = [
          'artist',
          'name',
          'type',
        ];
        const reducedCards = this.reduceArrayKeys(allCards, keysToKeep);
        this.cardsList[idx].items = reducedCards;
        console.log(async, reducedCards);
        clearInterval(secInterval);
        clearInterval(miliInterval);
      } catch (err) {
        this.cardsList[idx].loading = false;
        clearInterval(secInterval);
        clearInterval(miliInterval);
      }
    },
    callBackContructionApi(idx, cb) {
      this.cardsList[idx].loading = true;
      const secInterval = setInterval(() => {
        this.cardsList[idx].seconds += 1;
      }, 1000);
      const miliInterval = setInterval(() => {
        this.cardsList[idx].miliseconds += 1;
      }, 1);
      getAllCards()
        .then((res) => {
          this.cardsList[idx].loading = false;
          clearInterval(secInterval);
          clearInterval(miliInterval);
          cb(null, { res, idx });
        })
        .catch((err) => {
          this.cardsList[idx].loading = false;
          clearInterval(secInterval);
          clearInterval(miliInterval);
          cb(err);
        });
    },
    getResults(error, res) {
      if (error) {
        console.log(error);
        return;
      }
      const { idx } = res;
      const allCards = res.res;
      this.cardsList[idx].loading = false;
      const keysToKeep = [
        'artist',
        'name',
        'type',
      ];
      const reducedCards = this.reduceArrayKeys(allCards, keysToKeep);
      console.log(callBack, reducedCards);
      this.cardsList[idx].items = reducedCards;
    },
    promiseContructionApi(idx) {
      this.cardsList[idx].loading = true;
      const secInterval = setInterval(() => {
        this.cardsList[idx].seconds += 1;
      }, 1000);
      const miliInterval = setInterval(() => {
        this.cardsList[idx].miliseconds += 1;
      }, 1);
      return new Promise((resolve, reject) => {
        getAllCards()
          .then((res) => {
            const allCards = res;
            this.cardsList[idx].loading = false;
            const keysToKeep = [
              'artist',
              'name',
              'type',
            ];
            const reducedCards = this.reduceArrayKeys(allCards, keysToKeep);
            console.log(promise, reducedCards);
            this.cardsList[idx].items = reducedCards;
            clearInterval(secInterval);
            clearInterval(miliInterval);
            resolve(res);
          })
          .catch((err) => {
            clearInterval(secInterval);
            clearInterval(miliInterval);
            reject(err);
          });
      });
    },
  },
};
</script>
