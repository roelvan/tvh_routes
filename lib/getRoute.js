var geolib = require('geolib');
var Soap = require('soap');

var getRoute = function (startPoint, endPoint, callback) {
    // @TODO check geo arguments
    var calculatedRouteData = {
        totalDistance: 0,
        totalTime: 0
    };
    // Only send a request when geocoordinates aren't identical
    if (startPoint.latitude == endPoint.latitude && startPoint.longitude == endPoint.longitude) {
        if (callback) callback(null, calculatedRouteData);
    } else {
        var url = 'http://be-plw-tst-0009:8480/anymap/services/Router?wsdl';
        var args = {
            startPoint: {
                'attributes': {
                    'xsi:type': 'bean:LonLatPoint',
                    'xmlns:bean': 'http://beans.soap.geosolutions.be'
                },
                'lat': {
                    'attributes': {
                        'xsi:type': 'xsd:double'
                    },
                    $value: startPoint.latitude
                },
                'lon': {
                    'attributes': {
                        'xsi:type': 'xsd:double'
                    },
                    $value: startPoint.longitude
                }
            },
            endPoint: {
                'attributes': {
                    'xsi:type': 'bean:LonLatPoint',
                    'xmlns:bean': 'http://beans.soap.geosolutions.be'
                },
                'lat': {
                    'attributes': {
                        'xsi:type': 'xsd:double'
                    },
                    $value: endPoint.latitude
                },
                'lon': {
                    'attributes': {
                        'xsi:type': 'xsd:double'
                    },
                    $value: endPoint.longitude
                }
            },
            transportMode: {
                'attributes': {
                    'xsi:type': 'xsd:byte'
                },
                $value: 1
            },
            criteria: {
                'attributes': {
                    'xsi:type': 'xsd:byte'
                },
                $value: 0
            },
            returnRoute: {
                'attributes': {
                    'xsi:type': 'xsd:boolean'
                },
                $value: true
            },
            language: {
                'attributes': {
                    'xsi:type': 'xsd:string'
                },
                $value: true
            }
        };

        Soap.createClient(url, function(err, client) {
            client.getRoute(args, function(err, result) {
                if (err) {
                  console.log(startPoint);
                  console.log(endPoint);
                  throw err;
                }
                calculatedRouteData = {
                	totalDistance: result.getRouteReturn.totalDistance.$value,
                	totalTime: result.getRouteReturn.totalTime.$value,
                }
                callback(null, calculatedRouteData);
            });
        });

        // TEMP CODE TO REPLACE SOAP API -- DELETE AFTER TESTING
        // calculatedRouteData = {
        //     totalDistance: geolib.getDistance(startPoint, endPoint),
        //     totalTime: geolib.getDistance(startPoint, endPoint)
        // };
        // callback(null, calculatedRouteData);
    }
};

module.exports = getRoute;