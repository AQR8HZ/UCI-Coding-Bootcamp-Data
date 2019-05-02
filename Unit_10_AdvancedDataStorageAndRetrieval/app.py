import numpy as np
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine('sqlite:///Resources/hawaii.sqlite', connect_args={'check_same_thread': False}, echo=True)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<a href='http://localhost:5000/api/v1.0/precipitation'>/api/v1.0/precipitation</a><br/>"
        f"<a href='http://localhost:5000/api/v1.0/stations'>/api/v1.0/stations</a><br/>"
        f"<a href='http://localhost:5000/api/v1.0/tobs'>/api/v1.0/tobs</a><br/>"
        f"/api/v1.0/&lt;start&gt; and /api/v1.0/&lt;start&gt;/&lt;end&gt;"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    """Return a list of precipitation data including the precipitation and date"""
    results = session.query(Measurement.date, Measurement.prcp).all()

    # Create a dictionary from the row data and append to a list of measurements
    all_precipitations = []
    for date, prcp in results:
        precipitation_dict = {}
        precipitation_dict["date"] = date
        precipitation_dict["prcp"] = prcp
        all_precipitations.append(precipitation_dict)

    return jsonify(all_precipitations)

@app.route("/api/v1.0/stations")
def stations():
    """Return a list of station data including the station, name, longitud, latitud, elevation of each location"""
    # Query all passengers
    results = session.query(Station.station, Station.name, Station.latitude, Station.longitude, Station.elevation).all()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_stations = []
    for station, name, latitude, longitude, elevation in results:
        station_dict = {}
        station_dict["station "] = station 
        station_dict["name"] = name
        station_dict["latitude"] = latitude
        station_dict["longitude"] = longitude
        station_dict["elevation"] = elevation
        all_stations.append(station_dict)

    return jsonify(all_stations)


@app.route("/api/v1.0/tobs")
def tobs():

    # Latest Date
    first_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first()
    latest_year = int(first_date[0][:4])
    latest_month = int(first_date[0][5:7])
    latest_day = int(first_date[0][-2:])
    latest_date = dt.date(latest_year, latest_month, latest_day)

    previous_year = dt.date(latest_year - 1, latest_month, latest_day)

    results = session.query(Measurement.date, Measurement.tobs).\
    filter(func.strftime(Measurement.date) >= previous_year).all()

    # Create a dictionary from the row data and append to a list of all_temperature readings
    all_temperatures = []
    for date, tobs in results:
        tempreature_dict = {}
        tempreature_dict["date"] = date
        tempreature_dict["tobs"] = tobs
        all_temperatures.append(tempreature_dict)

    return jsonify(all_temperatures)

@app.route("/api/v1.0/<start_date>")
def calc_temps(start_date):

    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(func.strftime(Measurement.date) >= start_date).all()

    temperature_calcs = list(np.ravel(results))
    # Create a dictionary from the row data and present the tempreature calculations for the range of data selected
    calculations_dict = {}
    calculations_dict["TMIN"] = temperature_calcs[0]
    calculations_dict["TAVE"] = temperature_calcs[1]
    calculations_dict["TMAX"] = temperature_calcs[2]

    return jsonify(calculations_dict)

@app.route("/api/v1.0/<start_date>/<end_date>")
def calc_temps_for_range(start_date, end_date):
    
    results = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs)).\
        filter(func.strftime(Measurement.date) >= start_date).filter(func.strftime(Measurement.date) <= end_date).all()

    temperature_calcs = list(np.ravel(results))
    # Create a dictionary from the row data and present the tempreature calculations for the range of data selected
    calculations_dict = {}
    calculations_dict = {}
    calculations_dict["TMIN"] = temperature_calcs[0]
    calculations_dict["TAVE"] = temperature_calcs[1]
    calculations_dict["TMAX"] = temperature_calcs[2]

    return jsonify(calculations_dict)

if __name__ == '__main__':
    app.run(debug=True)
