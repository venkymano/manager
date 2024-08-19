import { useFormikContext } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';

interface EngineOptionProps {
  /**
   * list of engine ptions available
   */
  engineOptions: any[];
  /**
   * name used for the component to set formik field
   */
  name: string;
}
export const EngineOption = (props: EngineOptionProps) => {
  const [selectedDatabase, setDatabase] = React.useState<any>('');
  const formik = useFormikContext();
  const { engineOptions, name } = props;

  React.useEffect(() => {
    formik.setFieldValue(`${name}`, selectedDatabase.group);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDatabase]);

  const getEnginesList = () => {
    if (engineOptions === undefined) {
      return [];
    }
    return (
      engineOptions &&
      engineOptions.map((option) => {
        return { group: option.engine, label: option.id };
      })
    );
  };

  return (
    <Autocomplete
      onChange={(_: any, newValue, reason) =>
        reason === 'selectOption' && setDatabase(newValue)
      }
      groupBy={(option) => option.group}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      label="Engine Options"
      options={getEnginesList()}
      value={selectedDatabase ? selectedDatabase : null}
    />
  );
};
