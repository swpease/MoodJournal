import React from 'react';

import { createMount } from 'material-ui/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import CategoryView from '../CategoryView/CategoryView.js';
import CategoryWidget from '../CategoryWidget/CategoryWidget.js';


const BASEURL = '/api/categories';
let mock = new MockAdapter(axios);

mock.onGet(BASEURL).replyOnce(200, [
    {
        "url": "http://127.0.0.1:8000/api/categories/15/",
        "category": "Health",
        "rank": 2
    },
])
    .onGet(BASEURL).replyOnce(500)
    .onGet(BASEURL).reply(200, [
    {
        "url": "http://127.0.0.1:8000/api/categories/15/",
        "category": "Health",
        "rank": 2
    },
]);

it('renders without crashing', () => {
  let mount = createMount();
  const wrapper = mount(<CategoryView />);
});

it('displays an error on GET error', (done) => {
  let mount = createMount();
  const wrapper = mount(<CategoryView />);
  const assertions = () => {
    wrapper.update();
    expect(wrapper.text()).toContain('Error');
    done();
  };
  setTimeout(assertions, 100);
});

it('displays CategoryWidgets on data retrieval', (done) => {
  let mount = createMount();
  const wrapper = mount(<CategoryView />);
  const assertions = () => {
    wrapper.update();
    expect(wrapper.find(CategoryWidget).length).toBe(1);
    done();
  };
  setTimeout(assertions, 100);
});

it('passes state to CategoryWidget', (done) => {
  let mount = createMount();
  const wrapper = mount(<CategoryView />);
  const assertions = () => {
    wrapper.update();
    let cw = wrapper.find(CategoryWidget);
    console.log(wrapper.props(), wrapper.instance().props)
    expect(cw.prop('url')).toBe(wrapper.instance().props.url);
    done();
  };
  setTimeout(assertions, 100);
});
// mock.onPost(BASEURL).reply(201, {
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
