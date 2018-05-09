import React from 'react';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import CategoryView from '../CategoryView/CategoryView.js';
import CategoryWidget from '../CategoryWidget/CategoryWidget.js';
import CategoryCreator from '../CategoryCreator/CategoryCreator.js'
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';
import CategoryDeleter from '../CategoryDeleter/CategoryDeleter.js';

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';


// Not sure how stable this method is... used to pause running until promises resolve.
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const BASEGET = '/api/categories';
const BASEPOST = '/api/categories/';
let mock = new MockAdapter(axios);

mock.onGet(BASEGET).reply(200, [
    {
        "url": "http://127.0.0.1:8000/api/categories/15/",
        "category": "Health",
        "rank": 2
    },
]);

mock
    .onPost(BASEPOST).replyOnce(201, {
      "url": "http://127.0.0.1:8000/api/categories/56/",
      "category": "New Entry",
      "rank": 11
    })
    .onPost(BASEPOST).replyOnce(400, {
        "non_field_errors": [
            "There is already a category with this name."
        ]
    });

mock
    .onPatch("http://127.0.0.1:8000/api/categories/15/").replyOnce(200, {
      "url": "http://127.0.0.1:8000/api/categories/15/",
      "category": "Modded Entry",
      "rank": 2
    })
    .onPatch("http://127.0.0.1:8000/api/categories/15/").replyOnce(400, {
      "non_field_errors": [
          "There is already a category with this name."
      ]
    });

mock
    .onDelete("http://127.0.0.1:8000/api/categories/15/").replyOnce(204)
    .onDelete("http://127.0.0.1:8000/api/categories/15/").replyOnce(500);


it('renders without crashing', async () => {
  let wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();
});

/*
I'm calling the methods directly because I was having all sorts of strange
issues in attempting to use the `simulate` method, even though it works
fine in the shallow rendering. It would only work for the first call.
In any case, the things to remember are:
  1. use flushPromises() for the async mocked db hits
  2. update() the wrapper after each method call
  3. rebind any child components after any update() call
*/

// Equivocates to: click add btn => enter cat name => click save
it('can add new entries', async () => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cc = wrapper.find(CategoryCreator).children();
  cc.instance().toggleState({});
  wrapper.update();

  let ce = wrapper.find(CategoryEditor);
  ce.instance().handleChange({target: {value: 'New Entry'}});
  wrapper.update();

  ce = wrapper.find(CategoryEditor);
  ce.instance().props.handleSave(
    {},
    ce.instance().state.value,
    ce.instance().props.handleClose,
    ce.instance().handleError
  );
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(CategoryWidget).length).toBe(2);
  expect(wrapper.find(TextField).length).toBe(0);
});

it('displays an error if trying to add a duplicate category', async () => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cc = wrapper.find(CategoryCreator).children();
  cc.instance().toggleState({});
  wrapper.update();

  let ce = wrapper.find(CategoryEditor);
  ce.instance().handleChange({target: {value: 'Health'}});
  wrapper.update();

  ce = wrapper.find(CategoryEditor);
  ce.instance().props.handleSave(
    {},
    ce.instance().state.value,
    ce.instance().props.handleClose,
    ce.instance().handleError
  );
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(CategoryEditor).instance().state.error).toBeTruthy();

});

it('can edit preexisting entries', async () => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cw = wrapper.find(CategoryWidget).children();  // b/c wrapped in HOC
  cw.instance().toggleState({});
  wrapper.update();

  let ce = wrapper.find(CategoryEditor);
  ce.instance().handleChange({target: {value: 'Modded Entry'}}); //NB doesn't actually get passed to the mock axios call
  wrapper.update();

  ce = wrapper.find(CategoryEditor);
  ce.instance().props.handleSave(
    {},
    ce.instance().state.value,
    ce.instance().props.url,
    ce.instance().props.handleClose,
    ce.instance().handleError
  );
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(CategoryWidget).length).toBe(1);
  expect(wrapper.find(CategoryEditor).length).toBe(0);
  expect(wrapper.find(CategoryWidget).props().category).toBe('Modded Entry');
});

it('displays an error if trying to update to preexisting category', async ()  => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cw = wrapper.find(CategoryWidget).children();  // b/c wrapped in HOC
  cw.instance().toggleState({});
  wrapper.update();

  let ce = wrapper.find(CategoryEditor);
  ce.instance().handleChange({target: {value: 'Health'}}); // Couldn't actually happen.
  wrapper.update();

  ce = wrapper.find(CategoryEditor);
  ce.instance().props.handleSave(
    {},
    ce.instance().state.value,
    ce.instance().props.url,
    ce.instance().props.handleClose,
    ce.instance().handleError
  );
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(CategoryEditor).instance().state.error).toBeTruthy();
});

it('can delete entries', async () => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cd = wrapper.find(CategoryDeleter);
  cd.instance().props.handleDelete(cd.instance().props.url);
  await flushPromises();
  wrapper.update();

  expect(wrapper.find(CategoryWidget).length).toBe(0);
});

it('displays error on delete error', async () => {
  const wrapper = mount(<CategoryView />);
  await flushPromises();
  wrapper.update();

  let cd = wrapper.find(CategoryDeleter);
  cd.instance().props.handleDelete(cd.instance().props.url);
  await flushPromises();
  wrapper.update();

  expect(wrapper.text()).toContain("Error");
  expect(wrapper.find(CategoryWidget).length).toBe(0);
});
