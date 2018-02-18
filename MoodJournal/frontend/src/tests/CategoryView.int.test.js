import React from 'react';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import CategoryView from '../CategoryView/CategoryView.js';
import CategoryWidget from '../CategoryWidget/CategoryWidget.js';
import CategoryCreator from '../CategoryCreator/CategoryCreator.js'
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';

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

mock.onPost(BASEPOST).reply(201, {
    "url": "http://127.0.0.1:8000/api/categories/56/",
    "category": "New Entry",
    "rank": 11
});

mock.onPatch("http://127.0.0.1:8000/api/categories/56/").reply(200, {
    "url": "http://127.0.0.1:8000/api/categories/56/",
    "category": "Modded Entry",
    "rank": 11
});

mock.onDelete("http://127.0.0.1:8000/api/categories/56/").reply(204);


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

  let cc = wrapper.find(CategoryCreator);
  cc.instance().toggleState();
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
