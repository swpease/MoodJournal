import React from 'react';
import { createShallow } from 'material-ui/test-utils';

import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import EntryEditor from './EntryEditor.js';

const setup = propOverrides => {
  const props = Object.assign({
    date: '2018-01-01',
    qualityRatings: ['Good', 'OK', 'Bad'],
    handleCancel: jest.fn(),
    handleSave: jest.fn()
  }, propOverrides);

  let shallow = createShallow({untilSelector: EntryEditor});
  const wrapper = shallow(<EntryEditor {...props} />);

  return wrapper;
}

const POSTprops = {categories: [{pk: 1, category: 'cat'}]};
const PATCHprops = {category: 'cat', url: 'path/to/stuff', rating: 'OK', entry: 'my entry'};

it('renders POST without crashing', () => {
  setup(POSTprops);
});

it('renders PATCH without crashing', () => {
  setup(PATCHprops);
});

it('displays a category if PATCH', () => {
  const wrapper = setup(PATCHprops);
  let text = wrapper.find(Typography).at(1);
  expect(text.contains('cat')).toBeTruthy();
});

it('displays three editable widgets (TextField) in POST', () => {
  const wrapper = setup(POSTprops);
  let textfields = wrapper.find(TextField);
  expect(textfields.length).toBe(3);
});

it('displays two editable widgets (TextField) in PATCH', () => {
  const wrapper = setup(PATCHprops);
  let textfields = wrapper.find(TextField);
  expect(textfields.length).toBe(2);
});

it('displays a date', () => {
  const wrapper = setup(PATCHprops);
  let text = wrapper.find(Typography).at(0);
  expect(text.contains('2018-01-01')).toBeTruthy();
  const wrapper2 = setup(POSTprops);
  let text2 = wrapper2.find(Typography).at(0);
  expect(text2.contains('2018-01-01')).toBeTruthy();
});

it('calls handleCancel on Cancel btn click', () => {
  let wrapper = setup(POSTprops);
  let cancelBtn = wrapper.find(Button).last();
  cancelBtn.simulate('click');
  let handleCancel = wrapper.instance().props.handleCancel;
  expect(handleCancel.mock.calls.length).toEqual(1);
});

it('handles POST saving upon clicking the Save button', () => {
  let wrapper = setup(POSTprops);
  let saveBtn = wrapper.find(Button).first();
  saveBtn.simulate('click');
  let handleSave = wrapper.instance().props.handleSave;
  expect(handleSave.mock.calls.length).toEqual(1);
});

it('handles PATCH saving upon clicking the Save button', () => {
  let wrapper = setup(PATCHprops);
  let saveBtn = wrapper.find(Button).first();
  saveBtn.simulate('click');
  let handleSave = wrapper.instance().props.handleSave;
  expect(handleSave.mock.calls.length).toEqual(1);
});

it('Updates state upon entry text editor change', () => {
  let wrapper = setup(POSTprops);
  let textField = wrapper.find(TextField).last();
  textField.simulate('change', {
    target: {
      value: "ab"
    }
  });
  expect(wrapper.state('entry')).toBe('ab');
});

it('Save button enabled toggles if content changed or not', () => {
  let wrapper = setup(POSTprops);
  let saveBtn = wrapper.find(Button).first();
  expect(saveBtn.prop('disabled')).toBeTruthy();
  let textField = wrapper.find(TextField).last();
  textField.simulate('change', {
    target: {
      value: "ab"
    }
  });
  let saveBtn2 = wrapper.find(Button).first();
  expect(saveBtn2.prop('disabled')).toBeFalsy();
  textField.simulate('change', {
    target: {
      value: ""
    }
  });
  let saveBtn3 = wrapper.find(Button).first();
  expect(saveBtn3.prop('disabled')).toBeTruthy();
});
