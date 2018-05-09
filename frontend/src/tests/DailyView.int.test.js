import React from 'react';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import moment from 'moment';

import TextField from 'material-ui/TextField';

import DailyView from '../DailyView/DailyView.js';
import EntryWidget from '../EntryWidget/EntryWidget.js';
import EntryCreator from '../EntryCreator/EntryCreator.js';
import EntryEditor from '../EntryEditor/EntryEditor.js';


const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const BASE_ENTRIES_URL = '/api/entries/';
const ENTRIES_URL = '/api/entries/?date=' + moment().format('YYYY-MM-DD');
const CATEGORIES_URL = '/api/categories/';
const QR_URL = '/api/quality-ratings/';
const BASEPOST = '/api/entries/';

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

let mock = new MockAdapter(axios);

mock.onGet(ENTRIES_URL).reply(200, ENTRIES_DATA)
    .onGet(CATEGORIES_URL).reply(200, CATEGORIES_DATA)
    .onGet(QR_URL).reply(200, QR_DATA);

mock.onPost(BASE_ENTRIES_URL).replyOnce(201, {
      "url": "http://127.0.0.1:8000/api/entries/69/",
      "category": 15,
      "date": "2018-04-20",
      "entry": "New Entry!",
      "quality_rating": "Good"
});

mock.onPatch("http://127.0.0.1:8000/api/entries/10/").replyOnce(200, {
      "url": "http://127.0.0.1:8000/api/entries/10/",
      "category": 16,
      "date": "2018-01-05",
      "entry": "sleep.",
      "quality_rating": "Good"
    })
// Error testing.
    .onPatch("http://127.0.0.1:8000/api/entries/10/").replyOnce(400, {
    "category": [
        "An entry for this category on this date already exists."
    ]
})
    .onPatch("http://127.0.0.1:8000/api/entries/10/").replyOnce(400, {
    "entry": [
        "Ensure this field has no more than 5000 characters."
    ]
});

mock.onDelete("http://127.0.0.1:8000/api/entries/10/").replyOnce(204)
    .onDelete("http://127.0.0.1:8000/api/entries/10/").replyOnce(500);

it('renders without crashing', async () => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();
});
//        "An entry for this category on this date already exists."
//        "Ensure this field has no more than 5000 characters."

it('can add new entries', async () => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ec = wrapper.find(EntryCreator).children(); // b/c wrapped in HOC
  ec.instance().toggleState({});
  wrapper.update();

  let ee = wrapper.find(EntryEditor);
  ee.children().instance().handleChange('category')({target: {value: 'Health'}})
  ee.children().instance().handleChange('rating')({target: {value: 'Good'}})
  ee.children().instance().handleChange('entry')({target: {value: 'New entry created.'}})
  wrapper.update();

  ee = wrapper.find(EntryEditor);
  ee.children().instance().routeSave({}); // {} acts as empty error arg.
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(EntryWidget).length).toBe(3);
  expect(wrapper.find(EntryEditor).length).toBe(0);
});

it('can edit a preexisting entry', async () => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ew = wrapper.find(EntryWidget).first();
  ew.instance().toggleState({});
  wrapper.update();

  let ee = wrapper.find(EntryEditor);
  ee.children().instance().handleChange('entry')({target: {value: 'entry modified.'}})
  wrapper.update();

  ee = wrapper.find(EntryEditor);

  ee.children().instance().routeSave({});
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(EntryWidget).length).toBe(2);
  expect(wrapper.find(EntryEditor).length).toBe(0);
});

// NB: these two error tests just test the display (via state examination),
// NOT, the actual Django functionality (mocked axios response)
it('displays error on saving with preexisting category', async() => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ew = wrapper.find(EntryWidget).first();
  ew.instance().toggleState({});
  wrapper.update();

  let ee = wrapper.find(EntryEditor);
  ee.children().instance().handleChange('entry')({target: {value: 'entry modified.'}})
  wrapper.update();

  ee = wrapper.find(EntryEditor);

  ee.children().instance().routeSave({});
  await flushPromises();
  wrapper.update();
  expect(wrapper.find(EntryEditor).length).toBe(1);
  expect(wrapper.find(EntryEditor).children().instance().state.categoryError).toBeTruthy();
});

it('displays error on saving >5000 char entry', async() => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ew = wrapper.find(EntryWidget).first();
  ew.instance().toggleState({});
  wrapper.update();

  let ee = wrapper.find(EntryEditor);
  ee.children().instance().handleChange('entry')({target: {value: 'entry modified.'}})
  wrapper.update();

  ee = wrapper.find(EntryEditor);

  ee.children().instance().routeSave({});
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(EntryEditor).length).toBe(1);
  expect(wrapper.find(EntryEditor).children().instance().state.entryError).toBeTruthy();
});

// Delete tests
it('can delete entries', async () => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ew = wrapper.find(EntryWidget).first();
  ew.instance().props.handleDelete(ew.instance().props.url);
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(EntryWidget).length).toBe(1);
});

it('displays error on delete error', async () => {
  const wrapper = mount(<DailyView />);
  await flushPromises();
  wrapper.update();

  let ew = wrapper.find(EntryWidget).first();
  ew.instance().props.handleDelete(ew.instance().props.url);
  await flushPromises();
  wrapper.update();

  expect(wrapper.text()).toContain("Error");
});
