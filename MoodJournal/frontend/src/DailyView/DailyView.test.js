import React from 'react';

import { createShallow } from 'material-ui/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import moment from 'moment';

import DailyView from './DailyView.js';
import EntryWidget from '../EntryWidget/EntryWidget.js';
import EntryCreator from '../EntryCreator/EntryCreator.js';

// Not sure how stable this method is... used to pause running until promises resolve.
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const OLD_DATE = moment('2000-01-01');

const ENTRIES_URL = '/api/entries/?date=' + moment().format('YYYY-MM-DD');
const CATEGORIES_URL = '/api/categories/';
const QR_URL = '/api/quality-ratings/';
const HDC_URL = '/api/entries/?date=' + OLD_DATE.format('YYYY-MM-DD');


const ENTRIES_DATA = [
    {
        "url": "http://127.0.0.1:8000/api/entries/10/",
        "category": 16,
        "date": "2018-01-05",
        "entry": "I sleep.",
        "quality_rating": "Good"
    },
    {
        "url": "http://127.0.0.1:8000/api/entries/14/",
        "category": 15,
        "date": "2018-02-20",
        "entry": "Another day another dollar!",
        "quality_rating": "Good"
    },
];
const CATEGORIES_DATA = [
    {
        "url": "http://127.0.0.1:8000/api/categories/17/",
        "category": "Social",
        "rank": 10,
        "pk": 17
    },
    {
      "url": "http://127.0.0.1:8000/api/categories/15/",
      "category": "Health",
      "rank": 2,
      "pk": 15
    },
    {
    "url": "http://127.0.0.1:8000/api/categories/16/",
    "category": "Sleep",
    "rank": 1,
    "pk": 16
    }
];
const QR_DATA = [
  "Terrible",
  "Bad",
  "OK",
  "Good",
  "Excellent"
];

const HDC_DATA = [
    {
        "url": "http://127.0.0.1:8000/api/entries/19/",
        "category": 16,
        "date": "2018-08-05",
        "entry": "I sleep ok.",
        "quality_rating": "Good"
    },
];

let mock = new MockAdapter(axios);

mock.onGet(ENTRIES_URL).replyOnce(200, ENTRIES_DATA)
    .onGet(CATEGORIES_URL).replyOnce(200, CATEGORIES_DATA)
    .onGet(QR_URL).replyOnce(200, QR_DATA)

    .onGet(ENTRIES_URL).replyOnce(500)

    .onGet(ENTRIES_URL).replyOnce(200, ENTRIES_DATA)
    .onGet(CATEGORIES_URL).replyOnce(500)

    .onGet(ENTRIES_URL).replyOnce(200, ENTRIES_DATA)
    .onGet(CATEGORIES_URL).replyOnce(200, CATEGORIES_DATA)
    .onGet(QR_URL).replyOnce(500)

    .onGet(ENTRIES_URL).reply(200, ENTRIES_DATA)
    .onGet(CATEGORIES_URL).reply(200, CATEGORIES_DATA)
    .onGet(QR_URL).reply(200, QR_DATA)

    .onGet(HDC_URL).replyOnce(200, HDC_DATA)

    .onGet(HDC_URL).replyOnce(500);


it('renders without crashing', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
});

it('displays an error on GET entries error', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  // console.log(wrapper.state())
  expect(wrapper.text()).toContain("Error");
});

it('displays an error on GET categories error', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  // console.log(wrapper.state())
  expect(wrapper.text()).toContain("Error");
});

it('displays an error on GET qualityRatings error', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  // console.log(wrapper.state())
  expect(wrapper.text()).toContain("Error");
});

it('updates entries upon new date selection', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  expect(wrapper.find(EntryWidget).length).toBe(2);
  wrapper.instance().handleDateChange(OLD_DATE);
  await flushPromises();
  wrapper.update();
  expect(wrapper.find(EntryWidget).length).toBe(1);
});

it('displays an error on axios new date selection error', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  wrapper.instance().handleDateChange(OLD_DATE);
  await flushPromises();
  wrapper.update();
  expect(wrapper.text()).toContain("Error");
});

it('passes state to EntryWidget', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  let ew = wrapper.find(EntryWidget).first();
  const entry = wrapper.instance().state.entries[0];
  expect(ew.prop('url')).toBe(entry.url);
  expect(ew.prop('date')).toBe(entry.date);
  expect(ew.prop('rating')).toBe(entry.quality_rating);
  expect(ew.prop('entry')).toBe(entry.entry);
  expect(ew.prop('category')).toBe(wrapper.instance().getCategoryName(entry.category));
});

it('passes methods to EntryWidget', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  let ew = wrapper.find(EntryWidget).first();
  expect(ew.prop('handleDelete')).toBe(wrapper.instance().handleDelete);
  expect(ew.prop('handleSave')).toBe(wrapper.instance().handleUpdate);
});

it('passes state to EntryCreator', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  let ec = wrapper.find(EntryCreator);
  const state = wrapper.instance().state;
  expect(ec.prop('date')).toBe(moment().format('YYYY-MM-DD'));
  expect(ec.prop('qualityRatings')).toBe(state.qualityRatings);
  expect(ec.prop('categories')).toEqual(wrapper.instance().getUnusedCategories());
});

it('passes method to EntryCreator', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  let ec = wrapper.find(EntryCreator);
  expect(ec.prop('handleSave')).toBe(wrapper.instance().handleCreate);
});

it('categories filterer test', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  const category = [
    {
        "url": "http://127.0.0.1:8000/api/categories/17/",
        "category": "Social",
        "rank": 10,
        "pk": 17
    },
  ]
  expect(wrapper.instance().getUnusedCategories()).toEqual(category);
});

it('getCategoryName test', async () => {
  let shallow = createShallow({untilSelector: DailyView});
  const wrapper = shallow(<DailyView />);
  await flushPromises();
  wrapper.update();
  expect(wrapper.instance().getCategoryName(17)).toBe('Social');
});
