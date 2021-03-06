import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import SelectBox from '../Components/SelectBox';
import CounterBoxLg from '../Components/CounterBoxLg';
import CounterBox from '../Components/CounterBox';
import Disclaimer from '../Components/Disclaimer';
import Loading from '../Components/Loading';
import NotFound from '../Components/NotFound';

const CounterPage = () => {
  const [covidCount, setCovidCount] = useState(0);

  const [countryList, setCountryList] = useState({});
  const [countryCode, setCountryCode] = useState('ID');

  const [loadingCovidCount, setloadingCovidCount] = useState(true);
  const [loadingCountryList, setloadingCountryList] = useState(true);

  const [found, setFound] = useState(true);
  
  useEffect(() => {
    // covid data
    axios.get(`https://covid19.mathdro.id/api/countries/${countryCode}`)
      .then(res => {
        setCovidCount(res.data);
        setloadingCovidCount(false);
        setFound(true);
      })
      .catch(err => {
        console.log(err);
        setloadingCovidCount(false);
        setFound(false);
      });
  }, [countryCode]);

  useEffect(() => {
    // country list
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(res => {
        setCountryList(res.data);
        setloadingCountryList(false)
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleOnChange = (value) => {
    setloadingCovidCount(true);
    setCountryCode(value);
  }

  const { confirmed, recovered, deaths, lastUpdate } = covidCount;

  return (
    <div className="content">
      {
        loadingCountryList ? '' :
        <Fragment>
          <SelectBox countryList={countryList} countryCode={countryCode} handleOnChange={(e) => handleOnChange(e)}/>
          {
            loadingCovidCount ?  <Loading />:
            (!found) ? <NotFound text="Data tidak ditemukan." /> :
            <Fragment>
              <CounterBoxLg confirmed={confirmed} />
              <CounterBox confirmed={confirmed} recovered={recovered} deaths={deaths} />
              <Disclaimer lastUpdate={lastUpdate} />
            </Fragment>
          }
        </Fragment>
      }
    </div>
  )
}

export default CounterPage;
