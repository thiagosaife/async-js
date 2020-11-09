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
      { fn: (idx) => this.asyncContruction(idx), label: async },
      { fn: (idx) => this.callBackContruction(idx, this.getResults), label: callBack },
      { fn: (idx) => this.promiseContruction(idx), label: promise },
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
      interlvals: {},
    };
  },
  methods: {
    clearList(idx) {
      if (!this.cardsList[idx].items.length) return;
      this.cardsList[idx].items = [];
      this.cardsList[idx].seconds = 0;
      this.cardsList[idx].miliseconds = 0;
    },
    manageIntervals(idx, start) {
      if (start) {
        this.interlvals[`${idx}_s`] = setInterval(() => {
          this.cardsList[idx].seconds += 1;
          this.cardsList[idx].miliseconds = 0;
        }, 1000);
        this.interlvals[`${idx}_ms`] = setInterval(() => {
          this.cardsList[idx].miliseconds += 1;
        }, 1);
        return;
      }
      clearInterval(this.interlvals[`${idx}_s`]);
      clearInterval(this.interlvals[`${idx}_ms`]);
    },
    reduceCards(allCards) {
      const keysToKeep = [
        'artist',
        'name',
        'type',
      ];
      return this.reduceArrayKeys(allCards, keysToKeep);
    },
    async asyncContruction(idx) {
      this.cardsList[idx].loading = true;
      this.manageIntervals(idx, true);
      try {
        const allCards = await getAllCards();
        this.cardsList[idx].loading = false;
        this.cardsList[idx].items = this.reduceCards(allCards);
        this.manageIntervals(idx);
      } catch (err) {
        this.cardsList[idx].loading = false;
        this.manageIntervals(idx);
      }
    },
    callBackContruction(idx, cb) {
      this.cardsList[idx].loading = true;
      this.manageIntervals(idx, true);
      getAllCards()
        .then((res) => {
          this.cardsList[idx].loading = false;
          this.manageIntervals(idx);
          cb(null, { allCards: res, idx });
        })
        .catch((err) => {
          this.cardsList[idx].loading = false;
          this.manageIntervals(idx);
          cb(err);
        });
    },
    getResults(error, res) {
      if (error) return;
      const { allCards } = res;
      const { idx } = res;
      this.cardsList[idx].loading = false;
      this.cardsList[idx].items = this.reduceCards(allCards);
    },
    promiseContruction(idx) {
      this.cardsList[idx].loading = true;
      this.manageIntervals(idx, true);
      return new Promise((resolve, reject) => {
        getAllCards()
          .then((res) => {
            const allCards = res;
            this.cardsList[idx].loading = false;
            this.cardsList[idx].items = this.reduceCards(allCards);
            this.manageIntervals(idx);
            resolve(res);
          })
          .catch((err) => {
            this.manageIntervals(idx);
            reject(err);
          });
      });
    },
  },
};
</script>
