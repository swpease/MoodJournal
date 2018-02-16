import React from 'react';

import { createShallow } from 'material-ui/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import CategoryView from '../CategoryView/CategoryView.js';
import CategoryWidget from '../CategoryWidget/CategoryWidget.js';
import CategoryCreator from '../CategoryCreator/CategoryCreator.js'

// Not sure how stable this method is... used to pause running until promises resolve.
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const BASEURL = '/api/categories';
let mock = new MockAdapter(axios);

mock.onGet(BASEURL).replyOnce(500)
.onGet(BASEURL).replyOnce(500)
    .onGet(BASEURL).reply(200, [
    {
        "url": "http://127.0.0.1:8000/api/categories/15/",
        "category": "Health",
        "rank": 2
    },
]);

it('renders without crashing', () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
});

it('displays an error on GET error', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  expect(wrapper.text()).toContain("Error");
});

it('displays CategoryWidgets on data retrieval', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  expect(wrapper.find(CategoryWidget).length).toBe(1);
});

it('passes state to CategoryWidget', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  let cw = wrapper.find(CategoryWidget);
  expect(cw.prop('url')).toBe(wrapper.instance().state.data[0].url);
  expect(cw.prop('rank')).toBe(wrapper.instance().state.data[0].rank);
  expect(cw.prop('category')).toBe(wrapper.instance().state.data[0].category);
});

it('passes methods to CategoryWidget', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  let cw = wrapper.find(CategoryWidget);
  expect(cw.prop('handleDelete')).toBe(wrapper.instance().handleDelete);
  expect(cw.prop('handleUpdate')).toBe(wrapper.instance().handleUpdate);
});

it('passes method to CategoryCreator', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  let cc = wrapper.find(CategoryCreator);
  expect(cc.prop('handleCreate')).toBe(wrapper.instance().handleCreate);
});

it('has custom styles in a wrapper div', async () => {
  let shallow = createShallow({untilSelector: CategoryView});
  const wrapper = shallow(<CategoryView />);
  await flushPromises();
  wrapper.update();
  let shell = wrapper.find('div').first();
  expect(shell.prop('className')).toBeTruthy();
});

// // mock.onPost(BASEURL).reply(201, {
//     "url": "http://127.0.0.1:8000/api/categories/56/",
//     "category": "New Entry",
//     "rank": 11
// });
//
// mock.onPatch("http://127.0.0.1:8000/api/categories/56/").reply(200, {
//     "url": "http://127.0.0.1:8000/api/categories/56/",
//     "category": "Modded Entry",
//     "rank": 11
// });
//
// mock.onDelete("http://127.0.0.1:8000/api/categories/56/").reply(204);
