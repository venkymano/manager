import type { Engine } from '@linode/api-v4/lib/databases';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from 'src/components/Box';
import { Button } from 'src/components/Button/Button';
import { Divider } from 'src/components/Divider';
import { Notice } from 'src/components/Notice/Notice';
import { Paper } from 'src/components/Paper';
import { Typography } from 'src/components/Typography';
import {
  StyledDateCalendar,
  StyledTypography,
  useStyles,
} from 'src/features/Databases/DatabaseDetail/DatabaseBackups/DatabaseBackups.style';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import {
  isDateOutsideBackup,
  isTimeOutsideBackup,
  useIsDatabasesEnabled,
} from 'src/features/Databases/utilities';
import { useDatabaseQuery } from 'src/queries/databases/databases';
import DatabaseBackupsDialog from './DatabaseBackupsDialog';
import DatabaseBackupsLegacy from './legacy/DatabaseBackupsLegacy';

interface Props {
  disabled?: boolean;
}

export interface TimeOption {
  label: string;
  value: number;
}

const TIME_OPTIONS: TimeOption[] = [
  { label: '00:00', value: 0 },
  { label: '01:00', value: 1 },
  { label: '02:00', value: 2 },
  { label: '03:00', value: 3 },
  { label: '04:00', value: 4 },
  { label: '05:00', value: 5 },
  { label: '06:00', value: 6 },
  { label: '07:00', value: 7 },
  { label: '08:00', value: 8 },
  { label: '09:00', value: 9 },
  { label: '10:00', value: 10 },
  { label: '11:00', value: 11 },
  { label: '12:00', value: 12 },
  { label: '13:00', value: 13 },
  { label: '14:00', value: 14 },
  { label: '15:00', value: 15 },
  { label: '16:00', value: 16 },
  { label: '17:00', value: 17 },
  { label: '18:00', value: 18 },
  { label: '19:00', value: 19 },
  { label: '20:00', value: 20 },
  { label: '21:00', value: 21 },
  { label: '22:00', value: 22 },
  { label: '23:00', value: 23 },
];

export type VersionOption = 'newest' | 'dateTime';

export const DatabaseBackups = (props: Props) => {
  const { classes } = useStyles();
  const { disabled } = props;
  const { databaseId, engine } = useParams<{
    databaseId: string;
    engine: Engine;
  }>();
  const { isV2GAUser } = useIsDatabasesEnabled();

  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<DateTime | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<TimeOption | null>(
    null
  );
  const [versionOption, setVersionOption] = React.useState<VersionOption>(
    isV2GAUser ? 'newest' : 'dateTime'
  );

  const {
    data: database,
    error: databaseError,
    isLoading: isDatabaseLoading,
  } = useDatabaseQuery(engine, Number(databaseId));

  const isDefaultDatabase = database?.platform === 'rdbms-default';

  const oldestBackup = database?.oldest_restore_time
    ? DateTime.fromISO(database.oldest_restore_time)
    : null;

  const unableToRestoreCopy = !oldestBackup
    ? 'You can restore a backup after the first backup is completed.'
    : '';

  const onRestoreDatabase = () => {
    setIsRestoreDialogOpen(true);
  };

  const handleDateChange = (newDate: DateTime) => {
    const isSelectedTimeInvalid = isTimeOutsideBackup(
      selectedTime?.value,
      newDate,
      oldestBackup!
    );
    // If the user has selcted a time then changes the date,
    // that date + time might now be outside of the backup timeframe.
    // Reset selectedTime to null so user can select a valid time.
    if (isSelectedTimeInvalid) {
      setSelectedTime(null);
    }

    setSelectedDate(newDate);
  };

  const handleOnVersionOptionChange = (_: any, value: string) => {
    setVersionOption(value as VersionOption);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return isDefaultDatabase ? (
    <Paper style={{ marginTop: 16 }}>
      <Typography variant="h2">Summary</Typography>
      <StyledTypography>
        Databases are automatically backed-up with full daily backups for the
        past 10 days, and binary logs recorded continuously. Full backups are
        version-specific binary backups, which when combined with binary
        logs allow for consistent recovery to a specific point in time (PITR).
      </StyledTypography>
      <Divider spacingBottom={25} spacingTop={25} />
      <Typography variant="h2">Restore a Backup</Typography>
      <StyledTypography>
        {isV2GAUser ? (
          <span>
            The newest full backup plus incremental is selected by default. Or,
            select any date and time within the last 10 days you want to create
            a fork from.
          </span>
        ) : (
          <span>
            Select a date and time within the last 10 days you want to create a
            forkfrom.
          </span>
        )}
      </StyledTypography>
      {unableToRestoreCopy && (
        <Notice spacingTop={16} text={unableToRestoreCopy} variant="info" />
      )}
      {isV2GAUser && (
        <RadioGroup
          aria-label="type"
          name="type"
          onChange={handleOnVersionOptionChange}
          value={versionOption}
        >
          <FormControlLabel
            control={<Radio />}
            data-qa-dbaas-radio="Newest"
            disabled={disabled}
            label="Newest full backup plus incremental"
            value="newest"
          />
          <FormControlLabel
            control={<Radio />}
            data-qa-dbaas-radio="DateTime"
            disabled={disabled}
            label="Specific date & time"
            value="dateTime"
          />
        </RadioGroup>
      )}
      <Grid container justifyContent="flex-start" mt={2}>
        <Grid item lg={3} md={4} xs={12}>
          <Typography variant="h3">Date</Typography>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <StyledDateCalendar
              disabled={disabled || versionOption === 'newest'}
              shouldDisableDate={(date) =>
                isDateOutsideBackup(date, oldestBackup?.startOf('day'))
              }
              onChange={handleDateChange}
              value={selectedDate}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item lg={3} md={4} xs={12}>
          <Typography variant="h3">Time (UTC)</Typography>
          <FormControl style={{ marginTop: 0 }}>
            {/* TODO: Replace Time Select to the own custom date-time picker component when it's ready */}
            <Autocomplete
              autoComplete={false}
              className={classes.timeAutocomplete}
              disabled={disabled || !selectedDate || versionOption === 'newest'}
              getOptionDisabled={(option) =>
                isTimeOutsideBackup(option.value, selectedDate!, oldestBackup!)
              }
              label=""
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              onChange={(_, newTime) => setSelectedTime(newTime)}
              options={TIME_OPTIONS}
              placeholder="Choose a time"
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
              textFieldProps={{
                dataAttrs: {
                  'data-qa-time-select': true,
                },
              }}
              value={selectedTime}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            buttonType="primary"
            data-qa-settings-button="restore"
            disabled={
              versionOption === 'dateTime' && (!selectedDate || !selectedTime)
            }
            onClick={onRestoreDatabase}
          >
            Restore
          </Button>
        </Box>
      </Grid>
      {database ? (
        <DatabaseBackupsDialog
          database={database}
          onClose={() => setIsRestoreDialogOpen(false)}
          open={isRestoreDialogOpen}
          selectedDate={selectedDate}
          selectedTime={selectedTime?.value}
        />
      ) : null}
    </Paper>
  ) : (
    <DatabaseBackupsLegacy
      disabled={disabled}
      database={database}
      databaseError={databaseError}
      engine={engine}
      isDatabaseLoading={isDatabaseLoading}
    />
  );
};

export default DatabaseBackups;
