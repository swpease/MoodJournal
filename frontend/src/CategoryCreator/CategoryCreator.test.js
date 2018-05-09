import React from 'react';
import { createShallow } from 'material-ui/test-utils';

import CategoryCreator from './CategoryCreator';
import Button from 'material-ui/Button';
import CategoryEditor from '../CategoryEditor/CategoryEditor.js';

const setup = propOverrides => {
  const props = Object.assign({
    handleCreate: jest.fn(),
  }, propOverrides);

  let shallow = createShallow({untilSelector: 'CategoryCreator'});
  const wrapper = shallow(<CategoryCreator {...props} />);
  return wrapper;
}

it('renders without crashing', () => {
  setup();
});

it('defaults to showing a button', () => {
  let wrapper = setup();
  let button = wrapper.find(Button);
  expect(button.length).toBe(1);
});

it('shows a CategoryEditor upon button click', () => {
  let wrapper = setup();
  let button = wrapper.find(Button);
  button.simulate('click');
  let editor = wrapper.find(CategoryEditor);
  expect(editor.length).toBe(1);
});

it('passes close and save handlers to CategoryEditor', () => {
  let wrapper = setup();
  let button = wrapper.find(Button);
  button.simulate('click');
  let editor = wrapper.find(CategoryEditor);
  expect(editor.prop('handleSave')).toBe(wrapper.instance().props.handleCreate);
  expect(editor.prop('handleClose')).toBe(wrapper.instance().toggleState);
});
