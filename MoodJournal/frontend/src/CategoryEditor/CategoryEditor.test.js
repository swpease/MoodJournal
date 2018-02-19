import React from 'react';
import { shallow } from 'enzyme';

import CategoryEditor from './CategoryEditor.js';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

const setup = propOverrides => {
  const props = Object.assign({
    category: "Dummy",
    url: "path/to/resource",
    ariaLabel: "hey",
    handleClose: jest.fn(),
    handleSave: jest.fn(),
  }, propOverrides);

  const wrapper = shallow(<CategoryEditor {...props} />);

  return wrapper;
}

// Smoke test:
it('renders without crashing', () => {
  setup();
});

it('handles saving upon clicking the Save button', () => {
  let wrapper = setup();
  let saveBtn = wrapper.find(IconButton).first();
  saveBtn.simulate('click');
  let handleSave = wrapper.instance().props.handleSave;
  expect(handleSave.mock.calls.length).toEqual(1);
});

it('handles saving without a url', () => {
  let wrapper = setup({url: ""});
  let saveBtn = wrapper.find(IconButton).first();
  saveBtn.simulate('click');
  let handleSave = wrapper.instance().props.handleSave;
  expect(handleSave.mock.calls.length).toEqual(1);
});

it('handles canceling upon clicking the Cancel button', () => {
  let wrapper = setup();
  let cancelBtn = wrapper.find(IconButton).at(1);
  cancelBtn.simulate('click');
  let handleClose = wrapper.instance().props.handleClose;
  expect(handleClose.mock.calls.length).toEqual(1);
});

it('Save button disabled if content unchanged', () => {
  let wrapper = setup();
  let saveBtn = wrapper.find(IconButton).first();
  expect(saveBtn.prop('disabled')).toBeTruthy();
  let textField = wrapper.find(TextField);
  textField.simulate('change', {
    target: {
      value: "ab"
    }
  });
  let saveBtn2 = wrapper.find(IconButton).first();
  expect(saveBtn2.prop('disabled')).toBeFalsy();
  textField.simulate('change', {
    target: {
      value: "Dummy"
    }
  });
  let saveBtn3 = wrapper.find(IconButton).first();
  expect(saveBtn3.prop('disabled')).toBeTruthy();
});

it('Cannot save text over 50 characters long', () => {
  let wrapper = setup();
  let textField = wrapper.find(TextField);
  textField.simulate('change', {
    target: {
      value: "12345678912345678912345678912345678912345678912345"
    }
  });
  textField.simulate('change', {
    target: {
      value: "x12345678912345678912345678912345678912345678912345"
    }
  });
  let textField2 = wrapper.find(TextField);
  expect(textField2.prop('error')).toBeTruthy();
  textField.simulate('change', {
    target: {
      value: "12345678912345678912345678912345678912345678912345"
    }
  });
  let textField3 = wrapper.find(TextField);
  expect(textField3.prop('error')).toBeFalsy();
});
