import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';
import CloudPulseCustomSelect, { CloudPulseSelectTypes } from './CloudPulseCustomSelect';
import { fireEvent } from '@testing-library/react';


const queryMocks = vi.hoisted(() => ({
    useGetCustomFiltersQuery: vi.fn().mockReturnValue({}),
  }));
  
  vi.mock('src/queries/cloudview/customfilters', async () => {
    const actual = await vi.importActual('src/queries/cloudview/customfilters');
    return {
      ...actual,
      useGetCustomFiltersQuery: queryMocks.useGetCustomFiltersQuery,
    };
  });


describe('CloudPulseCustomSelect component tests', () => { 
    it('should render a component successfully with required props static', () => {
        const screen = renderWithTheme(<CloudPulseCustomSelect
            filterKey='testfilter'
            filterType='number'
            type={CloudPulseSelectTypes.static}
            handleSelectionChange={vi.fn()}
            options={[
                {
                    id:'1',
                    label:'Test1'
                }, 
                {
                    id:'2',
                    label:'Test2'
                }, 
            ]} 
            placeholder='Select a Test Filter' 
        />)

        expect(screen.getByPlaceholderText('Select a Test Filter')).toBeDefined();        
        const keyDown = screen.getByTestId('KeyboardArrowDownIcon');
        fireEvent.click(keyDown);
        fireEvent.click(screen.getByText('Test1'))
        const textField = screen.getByTestId('textfield-input');
        expect(textField.getAttribute('value')).toEqual('Test1');
    }),

    it('should render a component successfully with required props static with multi select', () => {
        const screen = renderWithTheme(<CloudPulseCustomSelect
            filterKey='testfilter'
            filterType='number'
            type={CloudPulseSelectTypes.static}
            handleSelectionChange={vi.fn()}
            options={[
                {
                    id:'1',
                    label:'Test1'
                }, 
                {
                    id:'2',
                    label:'Test2'
                }, 
            ]} 
            placeholder='Select a Test Filter' 
            isMultiSelect={true}
        />)

        expect(screen.getByPlaceholderText('Select a Test Filter')).toBeDefined();        
        const keyDown = screen.getByTestId('KeyboardArrowDownIcon');
        fireEvent.click(keyDown);
        fireEvent.click(screen.getByText('Test1'))        
        expect(screen.getAllByText('Test1').length).toEqual(2) // here it should be 2
        expect(screen.getAllByText('Test2').length).toEqual(1) // since we didn't select this option it should be 1
        fireEvent.click(screen.getByText('Test2'))

        expect(screen.getAllByText('Test1').length).toEqual(2) // here it should be 2
        expect(screen.getAllByText('Test2').length).toEqual(2) // since we did select this option it should be 2

        fireEvent.click(keyDown); // close the drop down

        expect(screen.getAllByText('Test1').length).toEqual(1)
        expect(screen.getAllByText('Test2').length).toEqual(1)
    }),

    it('should render a component successfully with required props dynamic', () => {

        queryMocks.useGetCustomFiltersQuery.mockReturnValue({
            data: [{
                id:'1',
                label:'Test1'
            }, 
            {
                id:'2',
                label:'Test2'
            }, ],
            isError: false,
            isLoading: false,
            status: 'success',
          })

        const screen = renderWithTheme(<CloudPulseCustomSelect
            filterKey='testfilter'
            filterType='number'
            type={CloudPulseSelectTypes.dynamic}
            handleSelectionChange={vi.fn()}
            dataApiUrl='http://some.test.com/filters'
            placeholder='Select a Test Filter'            
        />)
        
        console.log(screen.debug())
        expect(screen.getByPlaceholderText('Select a Test Filter')).toBeDefined();        
        const keyDown = screen.getByTestId('KeyboardArrowDownIcon');
        fireEvent.click(keyDown);
        fireEvent.click(screen.getByText('Test1'))       
        const textField = screen.getByTestId('textfield-input');
        expect(textField.getAttribute('value')).toEqual('Test1'); 

        
        
    }),

    it('should render a component successfully with required props dynamic multi select', () => {

        queryMocks.useGetCustomFiltersQuery.mockReturnValue({
            data: [{
                id:'1',
                label:'Test1'
            }, 
            {
                id:'2',
                label:'Test2'
            }, ],
            isError: false,
            isLoading: false,
            status: 'success',
          })

        const screen = renderWithTheme(<CloudPulseCustomSelect
            filterKey='testfilter'
            filterType='number'
            type={CloudPulseSelectTypes.dynamic}
            handleSelectionChange={vi.fn()}
            dataApiUrl='http://some.test.com/filters'
            placeholder='Select a Test Filter'     
            isMultiSelect={true}       
        />)
        
        console.log(screen.debug())
        expect(screen.getByPlaceholderText('Select a Test Filter')).toBeDefined();        
        const keyDown = screen.getByTestId('KeyboardArrowDownIcon');
        fireEvent.click(keyDown);
        fireEvent.click(screen.getByText('Test1'))       
        expect(screen.getAllByText('Test1').length).toEqual(2) // here it should be 2
        expect(screen.getAllByText('Test2').length).toEqual(1) // since we didn't select this option it should be 1
        fireEvent.click(screen.getByText('Test2'))

        expect(screen.getAllByText('Test1').length).toEqual(2) // here it should be 2
        expect(screen.getAllByText('Test2').length).toEqual(2) // since we did select this option it should be 2

        fireEvent.click(keyDown); // close the drop down

        expect(screen.getAllByText('Test1').length).toEqual(1)
        expect(screen.getAllByText('Test2').length).toEqual(1)

        
        
    })


})